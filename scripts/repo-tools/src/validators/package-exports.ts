import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import {
  type PackageDeclaration,
  exists,
  readBoundaries,
  readJson,
} from '../lib/workspace.js';

const run = promisify(execFile);

/** Files that must never reach a consumer's node_modules. */
const FORBIDDEN_PACKED = [
  /^src\//,
  /(^|\/)test\//,
  /\.test\.[cm]?tsx?$/,
  /^tsconfig(\..+)?\.json$/,
  /\.tsbuildinfo$/,
  /^\.eslintrc/,
];

interface NpmPackFile {
  readonly path: string;
}

interface NpmPackResult {
  readonly filename: string;
  readonly files: readonly NpmPackFile[];
}

/**
 * Proves a package is genuinely publishable by walking the real publication
 * path: pack it, install the tarball into a clean consumer, import it by public
 * package name, and execute an export.
 *
 * Importing `dist/` from inside the repository proves almost nothing. It
 * bypasses the `files` allowlist, the `exports` map, and dependency resolution
 * from outside the workspace — which is precisely where "works locally, broken
 * once published" failures live.
 */
export async function packageExportsValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];
  const manifest = await readBoundaries(rootDir);

  let packagesTested = 0;

  for (const [name, declaration] of Object.entries(manifest.packages)) {
    if (!declaration.published) continue;
    packagesTested += 1;
    findings.push(...(await smokeTestPackage(rootDir, name, declaration)));
  }

  return result('package-exports', findings, { packagesTested });
}

async function smokeTestPackage(
  rootDir: string,
  name: string,
  declaration: PackageDeclaration,
): Promise<Finding[]> {
  const findings: Finding[] = [];
  const packageDir = path.join(rootDir, declaration.path);

  if (!(await exists(path.join(packageDir, 'dist')))) {
    return [
      {
        rule: 'exports/not-built',
        message: `${name} has no dist/. Build before running the publication smoke test.`,
        path: declaration.path,
      },
    ];
  }

  const workDir = await mkdtemp(path.join(tmpdir(), 'repo-tools-smoke-'));
  try {
    // 1–3. Pack, and read exactly what would ship.
    let packed: NpmPackResult;
    try {
      const { stdout } = await run(
        'npm',
        ['pack', '--json', '--pack-destination', workDir],
        { cwd: packageDir, maxBuffer: 32 * 1024 * 1024 },
      );
      const parsed = JSON.parse(stdout) as readonly NpmPackResult[];
      const first = parsed[0];
      if (!first) throw new Error('npm pack produced no output');
      packed = first;
    } catch (error) {
      return [
        {
          rule: 'exports/pack-failed',
          message: `npm pack failed for ${name}: ${String(error)}`,
          path: declaration.path,
        },
      ];
    }

    const packedPaths = packed.files.map((file) => file.path);

    // 4. Nothing but build output and metadata may ship.
    for (const packedPath of packedPaths) {
      if (FORBIDDEN_PACKED.some((pattern) => pattern.test(packedPath))) {
        findings.push({
          rule: 'exports/forbidden-file-packed',
          message: `${name} would publish ${packedPath}. Only build output and metadata belong in the tarball; tighten "files".`,
          path: declaration.path,
        });
      }
    }

    // 5. Every exports-map target must actually be in the tarball.
    const pkg = await readJson<{ exports?: unknown }>(
      path.join(packageDir, 'package.json'),
    );
    for (const target of exportTargets(pkg.exports)) {
      const normalized = target.replace(/^\.\//, '');
      if (!packedPaths.includes(normalized)) {
        findings.push({
          rule: 'exports/target-not-packed',
          message: `${name} exports "${target}" but the tarball does not contain ${normalized}. Consumers would resolve to a missing file.`,
          path: declaration.path,
        });
      }
    }

    const smoke = declaration.smoke;
    if (!smoke) {
      findings.push({
        rule: 'exports/no-smoke-declaration',
        message: `${name} is published but declares no "smoke" entry in boundaries.json. A published package must prove it can be imported by public name.`,
        path: 'boundaries.json',
      });
      return findings;
    }

    // 6–7. Clean consumer, installed from the tarball, nothing from the workspace.
    const consumerDir = path.join(workDir, 'consumer');
    await run('mkdir', ['-p', consumerDir]);
    await writeFile(
      path.join(consumerDir, 'package.json'),
      `${JSON.stringify({ name: 'smoke-consumer', private: true, version: '0.0.0', type: 'module' }, null, 2)}\n`,
      'utf8',
    );

    try {
      await run(
        'npm',
        ['install', '--no-audit', '--no-fund', path.join(workDir, packed.filename)],
        {
          cwd: consumerDir,
          maxBuffer: 32 * 1024 * 1024,
        },
      );
    } catch (error) {
      findings.push({
        rule: 'exports/install-failed',
        message: `Installing the ${name} tarball into a clean consumer failed: ${String(error)}`,
        path: declaration.path,
      });
      return findings;
    }

    // 8–9. Import by public package name and execute.
    const script = [
      `import { ${smoke.export} } from ${JSON.stringify(smoke.import)};`,
      `const actual = ${smoke.export}(${smoke.call.map((argument) => JSON.stringify(argument)).join(', ')});`,
      `process.stdout.write(JSON.stringify(actual));`,
      '',
    ].join('\n');
    await writeFile(path.join(consumerDir, 'smoke.mjs'), script, 'utf8');

    try {
      const { stdout } = await run('node', ['smoke.mjs'], { cwd: consumerDir });
      const actual: unknown = JSON.parse(stdout);
      if (JSON.stringify(actual) !== JSON.stringify(smoke.expect)) {
        findings.push({
          rule: 'exports/unexpected-result',
          message: `${name}: ${smoke.export}(...) returned ${JSON.stringify(actual)}, expected ${JSON.stringify(smoke.expect)}.`,
          path: declaration.path,
        });
      }
    } catch (error) {
      findings.push({
        rule: 'exports/execution-failed',
        message: `Importing ${name} by public package name and executing ${smoke.export} failed in a clean consumer: ${String(error)}`,
        path: declaration.path,
      });
      return findings;
    }

    // 10. Declarations must resolve from the installed package, not the repo.
    for (const typesTarget of exportTargets(pkg.exports, 'types')) {
      const installed = path.join(
        consumerDir,
        'node_modules',
        smoke.import,
        typesTarget.replace(/^\.\//, ''),
      );
      if (!(await exists(installed))) {
        findings.push({
          rule: 'exports/types-unresolvable',
          message: `${name} declares types at ${typesTarget}, but the installed package has no such file. TypeScript consumers would fall back to \`any\`.`,
          path: declaration.path,
        });
      }
    }
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }

  return findings;
}

/** Collects export-map targets, optionally restricted to one condition. */
function exportTargets(exportsField: unknown, condition?: string): string[] {
  const targets: string[] = [];

  const walk = (node: unknown, activeCondition: string | undefined): void => {
    if (typeof node === 'string') {
      if (condition === undefined || activeCondition === condition) targets.push(node);
      return;
    }
    if (typeof node !== 'object' || node === null) return;

    for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
      walk(child, key.startsWith('.') ? activeCondition : key);
    }
  };

  walk(exportsField, undefined);
  return targets;
}

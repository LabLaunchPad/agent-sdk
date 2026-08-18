import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import {
  type BoundariesManifest,
  type PackageManifest,
  collectFiles,
  discoverPackageDirs,
  exists,
  extractImportSpecifiers,
  layerIndex,
  readBoundaries,
  readJson,
} from '../lib/workspace.js';

/** Node-only globals that betray a runtime assumption in neutral code. */
const NODE_ONLY_GLOBALS = [
  '__dirname',
  '__filename',
  'process.env',
  'process.cwd',
  'require(',
  'Buffer.',
] as const;

const ADAPTER_LAYER_INDEX = 4;
const TOOLING_LAYER_INDEX = 99;

/**
 * Enforces dependency direction, cycle-freedom, vendor isolation, runtime
 * neutrality and ESM specifier hygiene.
 *
 * A provider must never be able to define canonical state. If a low layer could
 * import an adapter, one vendor's model of a task would silently become *the*
 * model of a task — lost at the type level long before anyone noticed it at the
 * behaviour level.
 */
export async function packageBoundaryValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];

  let manifest: BoundariesManifest;
  try {
    manifest = await readBoundaries(rootDir);
  } catch (error) {
    return result('package-boundary', [
      {
        rule: 'boundary/manifest-unreadable',
        message: `boundaries.json could not be read: ${String(error)}`,
        path: 'boundaries.json',
      },
    ]);
  }

  const declaredByName = manifest.packages;
  const declaredPaths = new Map<string, string>();
  for (const [name, declaration] of Object.entries(declaredByName)) {
    declaredPaths.set(path.normalize(declaration.path), name);
  }

  // 1. Every package on disk is registered, and every registration resolves.
  const discovered = await discoverPackageDirs(rootDir);
  for (const relative of discovered) {
    if (!declaredPaths.has(path.normalize(relative))) {
      findings.push({
        rule: 'boundary/unregistered-package',
        message: `Package at ${relative} is not registered in boundaries.json. Register it with its layer and runtimeNeutral flag in the same commit that creates it.`,
        path: relative,
      });
    }
  }
  for (const [name, declaration] of Object.entries(declaredByName)) {
    if (!(await exists(path.join(rootDir, declaration.path, 'package.json')))) {
      findings.push({
        rule: 'boundary/missing-package',
        message: `boundaries.json declares ${name} at ${declaration.path}, but no package.json exists there.`,
        path: declaration.path,
      });
    }
  }

  const graph = new Map<string, string[]>();

  for (const [name, declaration] of Object.entries(declaredByName)) {
    const packageDir = path.join(rootDir, declaration.path);
    const manifestPath = path.join(packageDir, 'package.json');
    if (!(await exists(manifestPath))) continue;

    const pkg = await readJson<PackageManifest>(manifestPath);
    const ownLayer = layerIndex(manifest, declaration.layer);

    if (ownLayer === undefined) {
      findings.push({
        rule: 'boundary/unknown-layer',
        message: `${name} declares unknown layer "${declaration.layer}".`,
        path: declaration.path,
      });
      continue;
    }

    // 2. Manifest name matches its registration key.
    if (pkg.name !== name) {
      findings.push({
        rule: 'boundary/name-mismatch',
        message: `boundaries.json key ${name} does not match package.json name ${String(pkg.name)}.`,
        path: path.join(declaration.path, 'package.json'),
      });
    }

    // 3. Runtime dependencies point strictly outward, and never at a vendor.
    const runtimeDeps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.peerDependencies ?? {}),
    };
    graph.set(name, []);

    for (const dependency of Object.keys(runtimeDeps)) {
      const target = declaredByName[dependency];

      if (target) {
        graph.get(name)?.push(dependency);
        const targetLayer = layerIndex(manifest, target.layer);
        if (targetLayer !== undefined && targetLayer >= ownLayer) {
          findings.push({
            rule: 'boundary/inward-dependency',
            message: `${name} (layer ${declaration.layer}/${String(ownLayer)}) depends on ${dependency} (layer ${target.layer}/${String(targetLayer)}). Dependencies point outward only.`,
            path: path.join(declaration.path, 'package.json'),
          });
        }
        continue;
      }

      if (
        ownLayer < ADAPTER_LAYER_INDEX &&
        manifest.forbiddenInNonAdapterLayers.includes(dependency)
      ) {
        findings.push({
          rule: 'boundary/vendor-in-core',
          message: `${name} (layer ${declaration.layer}) depends on vendor package ${dependency}. Vendor and runtime-specific dependencies belong in the adapters layer.`,
          path: path.join(declaration.path, 'package.json'),
        });
      }
    }

    // 4. Runtime neutrality and ESM specifier hygiene across the package source.
    const sources = await collectFiles(path.join(packageDir, 'src'), ['.ts']);
    for (const sourcePath of sources) {
      const relativeSource = path.relative(rootDir, sourcePath);
      const source = await readFile(sourcePath, 'utf8');

      for (const specifier of extractImportSpecifiers(source)) {
        if (declaration.runtimeNeutral && specifier.startsWith('node:')) {
          findings.push({
            rule: 'boundary/node-import-in-neutral-package',
            message: `${relativeSource} imports "${specifier}", but ${name} is declared runtimeNeutral. Use web-standard APIs and put runtime-specific behaviour behind an adapter.`,
            path: relativeSource,
          });
        }
        if (specifier.startsWith('.') && !specifier.endsWith('.js')) {
          findings.push({
            rule: 'boundary/missing-esm-extension',
            message: `${relativeSource} imports "${specifier}" without an explicit .js extension. Under moduleResolution: nodenext this type-checks and then fails to load once published.`,
            path: relativeSource,
          });
        }
      }

      if (declaration.runtimeNeutral && ownLayer !== TOOLING_LAYER_INDEX) {
        for (const global of NODE_ONLY_GLOBALS) {
          if (source.includes(global)) {
            findings.push({
              rule: 'boundary/node-global-in-neutral-package',
              message: `${relativeSource} references Node-only global "${global}", but ${name} is declared runtimeNeutral.`,
              path: relativeSource,
            });
          }
        }
      }
    }
  }

  // 5. No dependency cycles between workspace packages.
  for (const cycle of findCycles(graph)) {
    findings.push({
      rule: 'boundary/cycle',
      message: `Dependency cycle: ${cycle.join(' -> ')}.`,
    });
  }

  return result('package-boundary', findings, {
    packagesDeclared: Object.keys(declaredByName).length,
    packagesDiscovered: discovered.length,
  });
}

function findCycles(graph: ReadonlyMap<string, readonly string[]>): string[][] {
  const cycles: string[][] = [];
  const state = new Map<string, 'visiting' | 'done'>();

  const walk = (node: string, trail: string[]): void => {
    const current = state.get(node);
    if (current === 'done') return;
    if (current === 'visiting') {
      const start = trail.indexOf(node);
      cycles.push([...trail.slice(start === -1 ? 0 : start), node]);
      return;
    }

    state.set(node, 'visiting');
    for (const next of graph.get(node) ?? []) {
      walk(next, [...trail, node]);
    }
    state.set(node, 'done');
  };

  for (const node of graph.keys()) walk(node, []);
  return cycles;
}

import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

export interface LayerDefinition {
  readonly index: number;
  readonly name: string;
}

export interface PackageDeclaration {
  readonly path: string;
  readonly layer: string;
  readonly runtimeNeutral: boolean;
  readonly published: boolean;
  readonly smoke?: {
    readonly import: string;
    readonly export: string;
    readonly call: readonly unknown[];
    readonly expect: unknown;
  };
}

export interface BoundariesManifest {
  readonly layers: readonly LayerDefinition[];
  readonly namespace: string;
  readonly packages: Readonly<Record<string, PackageDeclaration>>;
  readonly forbiddenInNonAdapterLayers: readonly string[];
}

export interface PackageManifest {
  readonly name?: string;
  readonly version?: string;
  readonly private?: boolean;
  readonly type?: string;
  readonly files?: readonly string[];
  readonly exports?: unknown;
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly peerDependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
}

export async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, 'utf8')) as T;
}

export async function exists(target: string): Promise<boolean> {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

export async function readBoundaries(rootDir: string): Promise<BoundariesManifest> {
  return readJson<BoundariesManifest>(path.join(rootDir, 'boundaries.json'));
}

export function layerIndex(
  manifest: BoundariesManifest,
  name: string,
): number | undefined {
  return manifest.layers.find((layer) => layer.name === name)?.index;
}

/**
 * Workspace package directories, discovered from disk rather than from the
 * boundaries manifest — the point is to catch packages that exist but were
 * never registered.
 */
export async function discoverPackageDirs(rootDir: string): Promise<string[]> {
  const roots = ['packages', 'adapters', 'scripts'];
  const found: string[] = [];

  for (const root of roots) {
    const absolute = path.join(rootDir, root);
    if (!(await exists(absolute))) continue;

    for (const entry of await readdir(absolute, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const dir = path.join(absolute, entry.name);

      if (await exists(path.join(dir, 'package.json'))) {
        found.push(path.relative(rootDir, dir));
        continue;
      }
      // adapters/ nests one level deeper: adapters/<kind>/<name>
      for (const nested of await readdir(dir, { withFileTypes: true })) {
        if (!nested.isDirectory()) continue;
        const nestedDir = path.join(dir, nested.name);
        if (await exists(path.join(nestedDir, 'package.json'))) {
          found.push(path.relative(rootDir, nestedDir));
        }
      }
    }
  }

  return found.sort();
}

/** Recursively collect files under `dir` matching one of `extensions`. */
export async function collectFiles(
  dir: string,
  extensions: readonly string[],
  skip: readonly string[] = ['node_modules', 'dist', 'coverage'],
): Promise<string[]> {
  if (!(await exists(dir))) return [];

  const collected: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collected.push(...(await collectFiles(absolute, extensions, skip)));
    } else if (extensions.some((extension) => entry.name.endsWith(extension))) {
      collected.push(absolute);
    }
  }
  return collected.sort();
}

export async function sha256OfFile(filePath: string): Promise<string> {
  return createHash('sha256')
    .update(await readFile(filePath))
    .digest('hex');
}

/**
 * Import specifiers appearing in a TypeScript source file.
 *
 * A regex rather than a full parse: this runs over first-party source that is
 * already type-checked and linted, so the cases a parser would additionally
 * catch (specifiers built at runtime) are not expressible as static imports
 * anyway. Covers `import`/`export ... from`, bare `import 'x'`, and dynamic
 * `import('x')`.
 */
export function extractImportSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  const patterns = [
    /(?:^|\n)\s*(?:import|export)\s[^;'"]*?from\s*['"]([^'"]+)['"]/g,
    /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (specifier !== undefined) specifiers.push(specifier);
    }
  }

  return specifiers;
}

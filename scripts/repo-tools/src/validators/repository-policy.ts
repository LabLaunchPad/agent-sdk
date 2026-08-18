import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  type Finding,
  type ValidatorOptions,
  type ValidatorResult,
  result,
} from '../lib/types.js';
import {
  type PackageManifest,
  discoverPackageDirs,
  exists,
  readJson,
} from '../lib/workspace.js';

interface AdapterRules {
  readonly maxLines: number;
  readonly mustReferenceCanonical: boolean;
  readonly forbidSharedHeadings: boolean;
  readonly maxSharedNgram: number;
}

interface RepoPolicy {
  readonly namespace: string;
  readonly requiredDirectories: readonly string[];
  readonly requiredFiles: readonly string[];
  readonly directoryReadmes: readonly string[];
  readonly canonicalDocument: string;
  readonly adapterDocuments: readonly string[];
  readonly adapterRules: AdapterRules;
}

/**
 * Enforces repository structure, the package namespace, and the rule that keeps
 * governance documents from forking.
 *
 * The duplication check matters more than it looks: a fact stated in four
 * places drifts in three of them, and every agent then pays to read all four
 * and reconcile them. `AGENTS.md` is canonical; the adapters point at it.
 */
export async function repositoryPolicyValidator(
  options: ValidatorOptions,
): Promise<ValidatorResult> {
  const { rootDir } = options;
  const findings: Finding[] = [];

  let policy: RepoPolicy;
  try {
    policy = await readJson<RepoPolicy>(path.join(rootDir, 'repo-policy.json'));
  } catch (error) {
    return result('repository-policy', [
      {
        rule: 'policy/manifest-unreadable',
        message: `repo-policy.json could not be read: ${String(error)}`,
        path: 'repo-policy.json',
      },
    ]);
  }

  for (const directory of policy.requiredDirectories) {
    if (!(await exists(path.join(rootDir, directory)))) {
      findings.push({
        rule: 'policy/missing-directory',
        message: `Required directory ${directory}/ is missing.`,
        path: directory,
      });
    }
  }

  for (const file of policy.requiredFiles) {
    if (!(await exists(path.join(rootDir, file)))) {
      findings.push({
        rule: 'policy/missing-file',
        message: `Required file ${file} is missing.`,
        path: file,
      });
    }
  }

  for (const directory of policy.directoryReadmes) {
    const readme = path.join(directory, 'README.md');
    if (!(await exists(path.join(rootDir, readme)))) {
      findings.push({
        rule: 'policy/missing-directory-readme',
        message: `${directory}/ has no README.md stating its purpose and source-of-truth status.`,
        path: readme,
      });
    }
  }

  // Namespace: every package on disk carries the org scope.
  for (const relative of await discoverPackageDirs(rootDir)) {
    const manifestPath = path.join(rootDir, relative, 'package.json');
    const pkg = await readJson<PackageManifest>(manifestPath);
    if (!pkg.name?.startsWith(`${policy.namespace}/`)) {
      findings.push({
        rule: 'policy/namespace-violation',
        message: `Package ${String(pkg.name)} at ${relative} must be named ${policy.namespace}/<name>.`,
        path: path.join(relative, 'package.json'),
      });
    }
  }

  findings.push(...(await checkAdapterDocuments(rootDir, policy)));

  return result('repository-policy', findings, {
    requiredDirectories: policy.requiredDirectories.length,
    requiredFiles: policy.requiredFiles.length,
    adapterDocuments: policy.adapterDocuments.length,
  });
}

async function checkAdapterDocuments(
  rootDir: string,
  policy: RepoPolicy,
): Promise<Finding[]> {
  const findings: Finding[] = [];
  const canonicalPath = path.join(rootDir, policy.canonicalDocument);
  if (!(await exists(canonicalPath))) return findings;

  const canonical = await readFile(canonicalPath, 'utf8');
  const canonicalHeadings = new Set(headings(canonical));
  const canonicalNgrams = ngrams(canonical, policy.adapterRules.maxSharedNgram);

  for (const document of policy.adapterDocuments) {
    const documentPath = path.join(rootDir, document);
    if (!(await exists(documentPath))) continue;

    const content = await readFile(documentPath, 'utf8');
    const lines = content.trimEnd().split('\n');

    if (lines.length > policy.adapterRules.maxLines) {
      findings.push({
        rule: 'policy/adapter-too-long',
        message: `${document} is ${String(lines.length)} lines; adapters are capped at ${String(policy.adapterRules.maxLines)}. Length is how duplication gets in.`,
        path: document,
      });
    }

    if (
      policy.adapterRules.mustReferenceCanonical &&
      !content.includes(policy.canonicalDocument)
    ) {
      findings.push({
        rule: 'policy/adapter-missing-canonical-reference',
        message: `${document} must point readers at ${policy.canonicalDocument}.`,
        path: document,
      });
    }

    if (policy.adapterRules.forbidSharedHeadings) {
      for (const heading of headings(content)) {
        if (canonicalHeadings.has(heading)) {
          findings.push({
            rule: 'policy/adapter-duplicates-canonical-heading',
            message: `${document} repeats the section "${heading}" from ${policy.canonicalDocument}. Reference it instead.`,
            path: document,
          });
        }
      }
    }

    for (const shared of ngrams(content, policy.adapterRules.maxSharedNgram)) {
      if (canonicalNgrams.has(shared)) {
        findings.push({
          rule: 'policy/adapter-duplicates-canonical-text',
          message: `${document} repeats ${String(policy.adapterRules.maxSharedNgram)} consecutive words from ${policy.canonicalDocument}: "${shared}". Reference the canonical text instead of restating it.`,
          path: document,
        });
        break;
      }
    }
  }

  return findings;
}

function headings(markdown: string): string[] {
  return [...markdown.matchAll(/^#{2,}\s+(.+?)\s*$/gm)]
    .map((match) => match[1]?.trim().toLowerCase())
    .filter((heading): heading is string => heading !== undefined);
}

function ngrams(markdown: string, size: number): Set<string> {
  const words = markdown
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const found = new Set<string>();
  for (let index = 0; index + size <= words.length; index += 1) {
    found.add(words.slice(index, index + size).join(' '));
  }
  return found;
}

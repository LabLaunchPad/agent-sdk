import { z } from 'zod';
import { defineContract } from '../harness/define-contract.js';

/**
 * @scaffold — delete in Phase 3.
 *
 * This exists only to exercise the conformance harness. It is deliberately not
 * a domain concept: Phase 0 prohibits agent contracts, and a placeholder that
 * looked like a real contract would invite later code to depend on it.
 *
 * Phase 3 replaces this directory with the actual contract kernel (Task, Goal,
 * Identity, Session, State, Capability, Policy, Evidence, Validation, Verdict,
 * Proof) and deletes this file.
 */
export const VersionTagSchema = z
  .object({
    major: z.int().min(0),
    minor: z.int().min(0),
    patch: z.int().min(0),
  })
  .strict();

export type VersionTag = z.infer<typeof VersionTagSchema>;

export const VersionTagContract = defineContract({
  name: '__scaffold__/VersionTag',
  schemaVersion: '1.0.0',
  schema: VersionTagSchema,
});

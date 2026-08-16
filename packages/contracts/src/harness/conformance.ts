import { Ajv } from 'ajv';
import type { Contract } from './define-contract.js';
import { serializeContract } from './define-contract.js';

/**
 * A single sample where the Zod schema and its JSON Schema projection reached
 * different verdicts. Every disagreement is a defect: the two representations
 * are meant to describe one contract, and consumers in different languages will
 * see different behaviour for the same input until it is resolved.
 */
export interface Disagreement {
  readonly sample: unknown;
  readonly zodAccepts: boolean;
  readonly jsonSchemaAccepts: boolean;
}

export interface ConformanceReport {
  readonly contract: string;
  readonly schemaVersion: string;
  /** True when Zod and JSON Schema agreed on every sample. */
  readonly agrees: boolean;
  readonly disagreements: readonly Disagreement[];
  /** True when serializing the contract twice produced identical bytes. */
  readonly serializationStable: boolean;
}

/**
 * Runs the round trip that makes a contract trustworthy:
 *
 *   Zod parse  ↔  JSON Schema validate  ↔  deterministic serialization
 *
 * `samples` should include both values that must be accepted and values that
 * must be rejected. A run over accepted values alone proves nothing — the
 * failure mode this catches is a projection that is *more permissive* than the
 * schema it was derived from.
 */
export function checkConformance<TOutput>(
  contract: Contract<TOutput>,
  samples: readonly unknown[],
): ConformanceReport {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(contract.jsonSchema);

  const disagreements: Disagreement[] = [];
  for (const sample of samples) {
    const zodAccepts = contract.schema.safeParse(sample).success;
    const jsonSchemaAccepts = validate(sample);
    if (zodAccepts !== jsonSchemaAccepts) {
      disagreements.push({ sample, zodAccepts, jsonSchemaAccepts });
    }
  }

  const serializationStable = serializeContract(contract) === serializeContract(contract);

  return {
    contract: contract.name,
    schemaVersion: contract.schemaVersion,
    agrees: disagreements.length === 0,
    disagreements,
    serializationStable,
  };
}

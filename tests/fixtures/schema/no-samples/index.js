// Declares a contract but no samples: agreement is unproven, which must fail.
export const UnprovenContract = {
  name: 'fixture/Unproven',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'object' },
};

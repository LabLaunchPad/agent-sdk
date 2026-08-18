export const C = {
  name: 'fixture/MinItems',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'array', minItems: 2 },
};
export const conformanceSamples = { 'fixture/MinItems': [[1]] };

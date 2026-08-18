export const C = {
  name: 'fixture/MaxItems',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'array', maxItems: 1 },
};
export const conformanceSamples = { 'fixture/MaxItems': [[1, 2]] };

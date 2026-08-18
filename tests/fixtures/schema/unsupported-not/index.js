export const C = {
  name: 'fixture/Not',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { not: { const: 'forbidden' } },
};
export const conformanceSamples = { 'fixture/Not': ['forbidden'] };

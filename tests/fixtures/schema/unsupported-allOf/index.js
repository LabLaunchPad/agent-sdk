export const C = {
  name: 'fixture/AllOf',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { allOf: [{ type: 'string' }, { minLength: 5 }] },
};
export const conformanceSamples = { 'fixture/AllOf': ['abc'] };

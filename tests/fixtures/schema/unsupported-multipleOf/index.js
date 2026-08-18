export const C = {
  name: 'fixture/MultipleOf',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'number', multipleOf: 10 },
};
export const conformanceSamples = { 'fixture/MultipleOf': [7] };

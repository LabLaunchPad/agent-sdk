export const C = {
  name: 'fixture/ExclusiveMinimum',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'number', exclusiveMinimum: 5 },
};
export const conformanceSamples = { 'fixture/ExclusiveMinimum': [5] };

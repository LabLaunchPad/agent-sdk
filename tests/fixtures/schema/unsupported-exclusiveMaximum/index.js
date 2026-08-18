export const C = {
  name: 'fixture/ExclusiveMaximum',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'number', exclusiveMaximum: 5 },
};
export const conformanceSamples = { 'fixture/ExclusiveMaximum': [5] };

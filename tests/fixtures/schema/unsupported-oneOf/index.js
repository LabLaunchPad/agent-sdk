export const C = {
  name: 'fixture/OneOf',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { oneOf: [{ type: 'string' }, { type: 'number' }] },
};
export const conformanceSamples = { 'fixture/OneOf': ['x', 1] };

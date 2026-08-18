export const C = {
  name: 'fixture/AnyOf',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { anyOf: [{ type: 'string' }, { type: 'number' }] },
};
export const conformanceSamples = { 'fixture/AnyOf': ['x'] };

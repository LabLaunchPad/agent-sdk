export const C = {
  name: 'fixture/NestedUnsupported',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: {
    type: 'object',
    properties: { a: { oneOf: [{ type: 'string' }, { type: 'number' }] } },
  },
};
export const conformanceSamples = { 'fixture/NestedUnsupported': [{ a: 'x' }] };

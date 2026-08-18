export const C = {
  name: 'fixture/PatternProperties',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'object', patternProperties: { '^s_': { type: 'string' } } },
};
export const conformanceSamples = { 'fixture/PatternProperties': [{ s_a: 123 }] };

export const C = {
  name: 'fixture/Format',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'string', format: 'email' },
};
export const conformanceSamples = { 'fixture/Format': ['not-an-email'] };

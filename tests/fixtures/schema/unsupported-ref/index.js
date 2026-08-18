export const C = {
  name: 'fixture/Ref',
  schemaVersion: '1.0.0',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { $defs: { S: { type: 'string' } }, $ref: '#/$defs/S' },
};
export const conformanceSamples = { 'fixture/Ref': [123] };

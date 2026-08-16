// The projection is MORE PERMISSIVE than the runtime schema: the schema requires
// the id to start with "ok", which JSON Schema here does not express. A
// TypeScript consumer rejects what a Python consumer accepts.
export const LeakyContract = {
  name: 'fixture/Leaky',
  schemaVersion: '1.0.0',
  schema: {
    safeParse(value) {
      const ok =
        typeof value === 'object' &&
        value !== null &&
        typeof value.id === 'string' &&
        value.id.startsWith('ok');
      return { success: ok };
    },
  },
  jsonSchema: {
    type: 'object',
    properties: { id: { type: 'string' } },
    required: ['id'],
    additionalProperties: false,
  },
};

export const conformanceSamples = {
  'fixture/Leaky': [{ id: 'ok-1' }, { id: 'nope' }],
};

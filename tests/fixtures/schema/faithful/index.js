// A projection that faithfully mirrors its runtime schema.
export const GoodContract = {
  name: 'fixture/Good',
  schemaVersion: '1.0.0',
  schema: {
    safeParse(value) {
      const ok =
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        typeof value.id === 'string' &&
        Object.keys(value).every((key) => key === 'id');
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
  'fixture/Good': [{ id: 'a' }, {}, { id: 1 }, { id: 'a', extra: true }, null, []],
};

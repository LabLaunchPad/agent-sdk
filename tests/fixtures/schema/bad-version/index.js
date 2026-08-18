// schemaVersion is not semver.
export const BadVersionContract = {
  name: 'fixture/BadVersion',
  schemaVersion: 'v1',
  schema: { safeParse: () => ({ success: true }) },
  jsonSchema: { type: 'object' },
};
export const conformanceSamples = { 'fixture/BadVersion': [{}] };

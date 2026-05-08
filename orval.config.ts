import { defineConfig } from 'orval';

export default defineConfig({
  eventsync: {
    input: './src/docs/OAS.yaml',
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      client: 'fetch',           
      clean: true,
      override: {
        mutator: {
          path: './src/api/client.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
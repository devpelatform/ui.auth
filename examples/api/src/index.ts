import { serve } from '@hono/node-server';

import { app } from '@repo/api';

const port = Number.parseInt(process.env.API_PORT || '3001');

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`Server is running on port ${port}`);
  },
);

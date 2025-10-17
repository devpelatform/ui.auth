import { logger as honoLogger } from 'hono/logger';

import { logger } from '@pelatform/utils';

export const loggerMiddleware = honoLogger((message, ...rest) => {
  logger.log(message, ...rest);
});

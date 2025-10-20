import { Hono } from 'hono';

import { healthRouter } from '../routes/health/router';
import { authRouter } from './auth/router';
import { userAvatarRouter } from './user/avatar/router';
import { userRouter } from './user/router';
import { workspaceLogoRouter } from './workspace/logo/router';

export const routes = new Hono()
  .basePath('/')
  .route('/health', healthRouter)
  .route('/auth', authRouter)
  .route('/user', userRouter)
  .route('/user/avatar', userAvatarRouter)
  .route('/workspace/logo', workspaceLogoRouter);

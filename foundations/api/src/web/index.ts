import { Hono } from 'hono';

import { authRouter } from './auth/router';
import { userAvatarRouter } from './user/avatar/router';
import { userRouter } from './user/router';

export const routes = new Hono()
  .basePath('/')
  .route('/auth', authRouter)
  .route('/user', userRouter)
  .route('/user/avatar', userAvatarRouter);

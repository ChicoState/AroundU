import { UserModel } from '@aroundu/shared';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: UserModel['_id'];
  }
}

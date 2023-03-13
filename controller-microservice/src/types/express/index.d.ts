import Express from 'express';
import { IUserToken } from '../user/user';

declare global {
  namespace Express {
    interface Request {
      user?: IUserToken;
    }
  }
}

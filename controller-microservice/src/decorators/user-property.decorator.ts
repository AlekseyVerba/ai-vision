import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IUserToken } from 'src/types/user/user';

export const UserProperty = createParamDecorator(
  (property: keyof IUserToken, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    if (!req.user) return undefined;

    const returnData = req.user[property] ? req.user[property] : undefined;
    return returnData;
  },
);

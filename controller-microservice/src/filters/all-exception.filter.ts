import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { GraphQLError } from 'graphql';
var getClassOf = Function.prototype.call.bind(Object.prototype.toString);
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any | GraphQLError, host: ArgumentsHost) {
    if (exception instanceof RpcException || exception.error) {
      const message = exception.message;
      throw new GraphQLError(message, {
        extensions: {
          status: false,
        },
      });
    }

    console.log(exception);
    return exception;
  }
}

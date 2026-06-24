import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTPRequest');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const { method, url, headers, body, query, params } = req;
    const startTime = Date.now();

    this.logger.log(
      `[REQUEST] ${method} ${url}\n` +
        `Headers: ${JSON.stringify(headers)}\n` +
        `Query: ${JSON.stringify(query)}\n` +
        `Params: ${JSON.stringify(params)}\n` +
        `Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `[RESPONSE] ${method} ${url} ${res.statusCode} - ${duration}ms`,
        );
      }),
    );
  }
}

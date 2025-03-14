import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // Interceptor passes through if the request is for metrics
    if (req.url === '/metrics') {
      return next.handle();
    }

    return next.handle().pipe(
      map((response) => {
        // If the response doesn't contain any object, return the response as is
        if (typeof response === 'string') {
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: 'Success',
            data: null,
            meta: { info: response },
          };
        }

        // If the response contains an object, return the object as is
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Success',
          data: response || null,
          meta: null,
        };
      }),
    );
  }
}

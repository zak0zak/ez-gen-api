import { Injectable, Logger, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const timestamp = new Date().toISOString();

        this.logger.log(`[${timestamp}] Incoming Request: ${method} ${url}`);

        return next.handle().pipe(
            tap((data) => {
                this.logger.log(`[${timestamp}] Response: ${data}`);
            }),
        );
    }
}

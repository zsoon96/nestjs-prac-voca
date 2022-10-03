import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";
import { Response, Request } from 'express';

@Catch(HttpException) // http통신에서의 모든 예외를 캐치
export class HttpExceptionFilter implements  ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                message: '예상치 못한 예외 발생!',
                path: request.url,
            })
    }
}
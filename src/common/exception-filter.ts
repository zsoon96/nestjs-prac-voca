import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";
import { Response, Request } from 'express';

@Catch() // http통신에서의 모든 예외를 캐치
export class HttpExceptionFilter implements  ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception.getResponse()

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                message
            })
    }
}
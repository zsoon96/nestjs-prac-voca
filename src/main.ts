import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {utilities as nestWinstonModuleUtilities, WinstonModule} from "nest-winston";
import * as winston from 'winston';

async function bootstrap() {
    const app = await NestFactory.create(AppModule,
        // 부트스트래핑 과정(모듈, 프로바이더, 의존성 주입 등을 초기화)에서 WinstonLogger는 사용이 불가 > 결국은 내장로그 사용!
        {
            logger: WinstonModule.createLogger({
                transports: [
                    new winston.transports.Console({
                        level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
                        format: winston.format.combine(
                            winston.format.errors({stack:true}),
                            winston.format.json(),
                            winston.format.ms(),
                            winston.format.timestamp(),
                            nestWinstonModuleUtilities.format.nestLike('MyVoca', {prettyPrint: true}))
                    })
                ]
            })
        }
        );
    app.enableCors();
    await app.listen(3001);
}

bootstrap();

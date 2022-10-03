import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from './board/board.module';
import {typeORMConfig} from "./configs/typeorm.config";
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import {WinstonModule, utilities as nestWinstonModuleUtilities} from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
      TypeOrmModule.forRoot(typeORMConfig),
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.local.env'
      }),
      WinstonModule.forRoot({
          transports: [
              new winston.transports.Console({
                  level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
                  format: winston.format.combine(
                      winston.format.timestamp(),
                      nestWinstonModuleUtilities.format.nestLike('MyVoca', {prettyPrint: true})
                  )
              })
          ]
      }),
      BoardModule,
      AuthModule
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}

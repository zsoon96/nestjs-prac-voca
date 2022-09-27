import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from './board/board.module';
import {typeORMConfig} from "./configs/typeorm.config";
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
      TypeOrmModule.forRoot(typeORMConfig),
      ConfigModule.forRoot({isGlobal: true}),
      BoardModule,
      AuthModule
  ],
  controllers: [],
  providers: [ConfigService],
})
export class AppModule {}

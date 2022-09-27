import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from './board/board.module';
import {typeORMConfig} from "./configs/typeorm.config";
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
      TypeOrmModule.forRoot(typeORMConfig),
      ConfigModule.forRoot({isGlobal: true}),
      BoardModule,
      AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

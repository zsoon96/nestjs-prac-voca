import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from './board/board.module';
import {typeORMConfig} from "./configs/typeorm.config";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
      TypeOrmModule.forRoot(typeORMConfig),
      BoardModule,
      AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

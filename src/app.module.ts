import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from './board/board.module';
import {typeORMConfig} from "./configs/typeorm.config";

@Module({
  imports: [
      TypeOrmModule.forRoot(typeORMConfig),
      BoardModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

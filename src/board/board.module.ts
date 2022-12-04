import {Module} from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import {BoardController} from './board.controller';
import {BoardRepository} from './board.repository';
import {BoardService} from './board.service';
import {CustomTypeOrmModule} from './typeorm-custom.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([BoardRepository]),
      AuthModule,
      FileModule
  ],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}

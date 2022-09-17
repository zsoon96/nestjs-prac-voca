import {Module} from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import {BoardController} from './board.controller';
import {BoardRepository} from './board.repository';
import {BoardService} from './board.service';
import {CustomTypeOrmModule} from './typeorm-custom.module';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([BoardRepository]),
      AuthModule
  ],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}

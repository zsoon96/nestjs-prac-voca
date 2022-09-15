import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {CustomTypeOrmModule} from "../board/typeorm-custom.module";
import {UserRepository} from './user.repository';

@Module({
  imports : [
    CustomTypeOrmModule.forCustomRepository([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}

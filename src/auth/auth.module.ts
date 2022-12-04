import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {CustomTypeOrmModule} from "../board/typeorm-custom.module";
import {UserRepository} from './user.repository';
import {JwtModule} from "@nestjs/jwt";
import * as config from 'config';
import {PassportModule} from "@nestjs/passport";
import { JwtStrategy } from './jwt.strategy';
import { KakaoStrategy } from './kakao.strategy';

const jwtConfig = config.get('jwt')

@Module({
  imports : [
      PassportModule.register({defaultStrategy: 'jwt'}),
      JwtModule.register({
        secret: jwtConfig.secret,
        signOptions: {
          expiresIn: jwtConfig.expiresIn
        }
      }),
    CustomTypeOrmModule.forCustomRepository([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}

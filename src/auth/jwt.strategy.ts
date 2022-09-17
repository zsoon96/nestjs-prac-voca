import {PassportStrategy} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Strategy, ExtractJwt} from 'passport-jwt'
import {UserRepository} from "./user.repository";
import * as config from 'config'

const JwtConfig = config.get('jwt')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userRepository: UserRepository
    ) {
        // 부모 컴포넌트의 것을 사용
        super({
            // 토큰이 유효한지 확인하기 위해 필요한 시크릿 키
            secretOrKey: JwtConfig.secret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    // 상단 로직을 통해 토큰이 유효한지 확인이 되면 실행되는 함수
    async validate(payload) {
        // 토큰의 payload에 담겨있던 email로 user 조회
        const {email} = payload
        const user = await this.userRepository.findOneBy({email})

        if (!user) {
            throw new UnauthorizedException('토큰이 유효하지 않습니다.')
        }

        return user
    }
}
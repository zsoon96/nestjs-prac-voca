import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-kakao";
import * as config from 'config'
import { KakaoUserLoginDto } from "./dto/kakao-login-user.dto";

const kakaoConfig = config.get('kakao')

export class KakaoStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            clientID: kakaoConfig.clientID,
            callbackURL: kakaoConfig.callbackURL
        });
    }

    async validate(accessToken, refreshToken, profile, done) {
        const profileJson = profile._json
        // console.log(profileJson)
        const kakao_account = profileJson.kakao_account
        const payload: KakaoUserLoginDto = {
            email: kakao_account.email,
            username: kakao_account.profile.nickname,
            birth: kakao_account.birthday,
            accessToken
        }
        // done (에러 시, 성공 시)
        done(null, payload)
    }
}
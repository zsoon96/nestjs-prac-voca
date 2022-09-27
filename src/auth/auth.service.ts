import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import * as bcrypt from 'bcryptjs'
import {JwtService} from "@nestjs/jwt";
import {UserLoginResDto} from './dto/login-res.dto'
import axios from "axios";
import {KakaoUserLoginDto} from "./dto/kakao-login-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {
    }


    async signUp(userCreateDto: UserCreateDto): Promise<void> {
        return this.userRepository.createUser(userCreateDto)
    }

    async signIn(userLoginDto: UserLoginDto): Promise<UserLoginResDto> {
        const {email, password} = userLoginDto
        const user = await this.userRepository.findOneBy({email})

        if (user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 (secret + payload 필요)
            const payload = {email}
            const accessToken = this.jwtService.sign(payload)

            const loginDto = {
                loginSuccess: true,
                accessToken: accessToken
            }
            return loginDto

        } else {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.')
        }
    }

    // async signOut(accessToken: string): Promise<{ accessToken: string }> {
    //     accessToken = ''
    //     return {accessToken}
    // }

    async signOut(): Promise<boolean> {
        return false
    }

    async authCheck(accessToken: string): Promise<boolean> {
        // console.log(accessToken)
        if (accessToken === 'undefined') {
            return false
        } else {
            return true
        }
    }

    async kakaoUserInfo(code: string): Promise<KakaoUserLoginDto> {
        // qs 라이브러리 사용하여 데이터 인코딩
        // application/x-www-form-urlencoded 포멧 대신 데이터를 보내기 위해 사용
        const qs = require('qs');

        const body = {
            grant_type: 'authorization_code',
            client_id: '796fc24ede3f528012f5ffb2d6a99f06',
            redirect_uri: 'http://localhost:3000/auth/kakaoCallback',
            code: code
        }

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        };

        try {
            // 1- 인가코드와 그외 필요한 요청 값을 담아 카카오 서버 /oauth/token으로 토큰 요청
            const response = await axios({
                method:'POST',
                url: 'https://kauth.kakao.com/oauth/token',
                timeout: 30000,
                headers,
                data: qs.stringify(body)
            })

            const accessToken: string = response.data.access_token

            if (response.status === 200) {
                const headerUserInfo = {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    Authorization: 'Bearer ' + accessToken
                }

                // 2- 카카오로부터 받은 토큰 값 헤더에 담아 카카오 서버 /v2/user/me로 사용자 정보 요청
                const responseUserInfo = await axios({
                    method: 'GET',
                    url: 'https://kapi.kakao.com/v2/user/me',
                    timeout: 30000,
                    headers: headerUserInfo
                })

                // 3- 카카오로부터 받은 사용자 정보들 중에서 필요한 값만 담아 응답값 반환
                if (responseUserInfo.status === 200) {

                    const kakaoUserInfo = {
                        email: responseUserInfo.data.kakao_account.email,
                        username: responseUserInfo.data.kakao_account.profile.nickname,
                        birth: responseUserInfo.data.kakao_account.birthday,
                        accessToken: accessToken
                    }
                    return kakaoUserInfo

                } else {
                    throw new UnauthorizedException()
                }

            } else {
                throw new UnauthorizedException()
            }
        } catch (e) {
            // console.log(e)
            throw new UnauthorizedException('여기가 왜 자꾸 말썽일까')
        }
    }

    // 4- 사용자 정보를 다시 프론트를 통해 요청을 하면 기존 로그인 로직처럼 로그인 처리
    async kakaoSignIn(kakaoUserLoginDto : KakaoUserLoginDto): Promise<UserLoginResDto> {
        const { email, username, birth } = kakaoUserLoginDto;

        let user = await this.userRepository.findOneBy({email})

        // 존재하는 이메일이 없으면 생성
        if (!user) {
            user = this.userRepository.create({
                email,
                username,
                birth,
            })

            try {
                await this.userRepository.save(user)
            } catch (e) {
                console.log(e)
            }
        }

        // 로그인 처리가 완료된 응답값 반환
        const payload = { email };
        const accessToken = await this.jwtService.sign(payload)

        const loginDto = {
            loginSuccess: true,
            accessToken: accessToken
        }

        return loginDto
    }
}

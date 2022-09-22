import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import * as bcrypt from 'bcryptjs'
import {JwtService} from "@nestjs/jwt";
import {UserLoginResDto} from './dto/login-res.dto'
import {config} from "config";
import axios from "axios";
import qs from 'qs';

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

    async signOut(accessToken: string): Promise<{ accessToken: string }> {
        accessToken = ''
        return {accessToken}
    }

    async authCheck(accessToken: string): Promise<boolean> {
        if (!accessToken) {
            return false
        } else {
            return true
        }
    }

    async kakaoSignIn(code: string): Promise<string> {

        // qs 라이브러리 사용하여 데이터 인코딩
        // application/x-www-form-urlencoded 포멧 대신 데이터를 보내기 위해 사용
        const qs = require('qs');

        const body = {
            grant_type: 'authorization_code',
            client_id: '796fc24ede3f528012f5ffb2d6a99f06',
            redirect_uri: 'http://localhost:3001/auth/kakao',
            code: code
        }

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        };

        try {
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

                const responseUserInfo = await axios({
                    method: 'GET',
                    url: 'https://kapi.kakao.com/v2/user/me',
                    timeout: 30000,
                    headers: headerUserInfo
                })

                console.log(responseUserInfo.data)

                if (responseUserInfo.status === 200) {
                    return responseUserInfo.data
                } else {
                    throw new UnauthorizedException()
                }
            } else {
                throw new UnauthorizedException()
            }
            return '토큰 요청 성공'
        } catch (e) {
            // console.log(e)
            throw new UnauthorizedException()
        }
    }
}

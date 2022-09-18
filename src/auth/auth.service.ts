import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import * as bcrypt from 'bcryptjs'
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp ( userCreateDto: UserCreateDto ) : Promise<void> {
        return this.userRepository.createUser(userCreateDto)
    }

    async signIn ( userLoginDto: UserLoginDto ) : Promise<{ accessToken:string }> {
        const { email, password } = userLoginDto
        const user = await this.userRepository.findOneBy({email})

        if ( user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 (secret + payload 필요)
            const payload = { email }
            const accessToken = this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.')
        }
    }

    async signOut (accessToken:string) : Promise<{accessToken: string}> {
        accessToken = ''
        return {accessToken}
    }
}

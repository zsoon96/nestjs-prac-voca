import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository
    ) {}

    async signUp ( userCreateDto: UserCreateDto ) : Promise<void> {
        return this.userRepository.createUser(userCreateDto)
    }

    async signIn ( userLoginDto: UserLoginDto ) : Promise<string> {
        const { email, password } = userLoginDto
        const user = await this.userRepository.findOneBy({email})

        if ( user && (await bcrypt.compare(password, user.password))) {
            return '로그인에 성공하였습니다.'
        } else {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.')
        }
    }
}

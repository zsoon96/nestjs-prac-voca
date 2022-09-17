import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    // ValidationPipe로 Dto의 유효성 체크 설정
    signup (@Body(ValidationPipe) userCreateDto: UserCreateDto): Promise<void> {
        return this.authService.signUp(userCreateDto)
    }

    @Post('/login')
    signIn (@Body(ValidationPipe) userLoginDto: UserLoginDto ): Promise<{ accessToken:string }> {
        return this.authService.signIn(userLoginDto)
    }
}

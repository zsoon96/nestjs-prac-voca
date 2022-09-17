import {Body, Controller, Post, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserCreateDto} from "./dto/create-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    // ValidationPipe로 Dto의 유효성 체크 설정
    signup (@Body(ValidationPipe) userCreateDto: UserCreateDto): Promise<void> {
        return this.authService.signUp(userCreateDto)
    }
}

import {Body, Controller, Post, Req, Res, UseGuards, ValidationPipe} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {AuthService} from "./auth.service";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import {GetUser} from "./get-user.decorator";
import {User} from "./user.entity";

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

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@GetUser() user:User) {
    //     console.log(user)
    // }

    @Post('/logout')
    signOut (@Req() req) : Promise<{accessToken:string}> {
        const accessToken = req.headers.authorization
        return this.authService.signOut(accessToken)
    }
}

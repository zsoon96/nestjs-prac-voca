import {Body, Controller, Get, Post, Req, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import {UserLoginResDto} from "./dto/login-res.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

   @Post('/signup')
    // ValidationPipe로 Dto의 유효성 체크 설정
    signup (@Body(ValidationPipe) userCreateDto: UserCreateDto): Promise<void> {
        return this.authService.signUp(userCreateDto)
    }

    @Post('/login')
    signIn (@Body(ValidationPipe) userLoginDto: UserLoginDto ): Promise<UserLoginResDto> {
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

    @Get('/check')
    authCheck (@Req() req) : Promise<boolean> {
        const accessToken = req.headers.authorization
        return this.authService.authCheck(accessToken)
    }
}

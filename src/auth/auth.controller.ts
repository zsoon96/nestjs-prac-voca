import {Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import {UserLoginResDto} from "./dto/login-res.dto";
import { KakaoUserLoginDto } from './dto/kakao-login-user.dto';
import { AuthGuard } from '@nestjs/passport';

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

    @Get('/kakao')
    // @UseGuards(AuthGuard('kakao'))
    kakaoUserInfo (@Req() req): Promise<KakaoUserLoginDto>{
        const code = req.query.code
        return this.authService.kakaoUserInfo(code)
        // return '코드 받기 성공'
    }

    @Post('/kakao/login')
    // @UseGuards(AuthGuard('kakao'))
    async kakaoLoginCallback(@Req() req) : Promise<UserLoginResDto> {
        const kakaoUserLoginDto:KakaoUserLoginDto = req.body
        return this.authService.kakaoSignIn(kakaoUserLoginDto)
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

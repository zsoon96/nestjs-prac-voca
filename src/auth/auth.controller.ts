import {Body, Controller, Get, Post, Req, ValidationPipe, Res, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserCreateDto} from "./dto/create-user.dto";
import {UserLoginDto} from "./dto/login-user.dto";
import {UserLoginResDto} from "./dto/login-res.dto";
import {KakaoUserLoginDto} from './dto/kakao-login-user.dto';
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "./get-user.decorator";
import {User} from "./user.entity";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('/signup')
    // ValidationPipe로 Dto의 유효성 체크 설정
    signup(@Body(ValidationPipe) userCreateDto: UserCreateDto): Promise<void> {
        return this.authService.signUp(userCreateDto)
    }

    @Post('/login')
    async signIn(@Body(ValidationPipe) userLoginDto: UserLoginDto, @Res() res): Promise<UserLoginResDto> {
        const jwt = await this.authService.signIn(userLoginDto);
        res.setHeader('Authorization','Bearer ' + jwt.accessToken);
        res.cookie('token', jwt.accessToken, {
            // 서버에서 httpOnly 옵션을 줘도 브라우저에 적용 x
            httpOnly: true
        });
        return res.send(jwt)
        // return this.authService.signIn(userLoginDto)
    }

    // 프론트로부터 인가 코드를 받아 '사용자 정보'를 반환해주는 컨트롤러
    @Get('/kakao')
    // @UseGuards(AuthGuard('kakao'))
    kakaoUserInfo(@Req() req): Promise<KakaoUserLoginDto> {
        const code = req.query.code
        return this.authService.kakaoUserInfo(code)
    }

    // 프론트로부터 사용자 정보를 받아 '로그인 처리값'을 반환해주는 컨트롤러
    @Post('/kakao/login')
    // @UseGuards(AuthGuard('kakao'))
    async kakaoLoginCallback(@Req() req): Promise<UserLoginResDto> {
        const kakaoUserLoginDto: KakaoUserLoginDto = req.body
        return this.authService.kakaoSignIn(kakaoUserLoginDto)
    }

    // @Post('/test')
    // @UseGuards(AuthGuard())
    // test(@GetUser() user:User) {
    //     console.log(user)
    // }

    // @Post('/logout')
    // signOut (@Req() req) : Promise<{accessToken:string}> {
    //     const accessToken = req.headers.authorization
    //     return this.authService.signOut(accessToken)
    // }

    @Post('/logout')
    signOut(@Req() req): Promise<boolean> {
        return this.authService.signOut()
    }

    @Get('/check')
    authCheck(@Req() req): Promise<boolean> {
        // @Body()로 데이터가 안들어와서 헤더 값으로 데이터 추출
        const accessToken = req.headers.authorization.split(' ')[1]
        return this.authService.authCheck(accessToken)
    }

    // 유저 정보 조회
    @UseGuards(AuthGuard())
    @Get('/me')
    getUserInfo(@GetUser() user: User) {
        console.log(user)
        return user;
    }
}

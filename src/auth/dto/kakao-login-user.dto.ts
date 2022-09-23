import {IsEmail, IsString} from "class-validator";

export class KakaoUserLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    nickname: string;

    @IsString()
    birth: string;

    @IsString()
    accessToken: string;
}
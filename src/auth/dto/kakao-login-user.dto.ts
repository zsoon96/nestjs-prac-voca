import {IsEmail, IsString} from "class-validator";

export class KakaoUserLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    birth: string;

    @IsString()
    accessToken: string;
}
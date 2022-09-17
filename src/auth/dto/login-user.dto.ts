import {IsEmail, Matches} from "class-validator";

export class UserLoginDto {
    @IsEmail()
    email: string;

    @Matches(/^[a-zA-Z0-9]*$/,{message: '비밀번호는 숫자와 영문으로만 작성해주세요.'})
    password: string;
}
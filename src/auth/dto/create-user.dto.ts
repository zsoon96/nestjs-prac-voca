import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class UserCreateDto {
    @IsEmail()
    email: string

    @Matches(/^[a-zA-Z0-9]*$/,{message: '비밀번호는 숫자와 영문으로만 작성해주세요.'})
    password: string

    @IsString()
    username: string

    @IsString()
    @MinLength(2, {message: '닉네임은 최소 2글자 이상으로 작성해주세요.'})
    nickname: string

    birth: string

    phone: string
}
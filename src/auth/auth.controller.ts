import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UserCreateDto} from "./dto/create-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signup (@Body() userCreateDto: UserCreateDto): Promise<void> {
        return this.authService.signUp(userCreateDto)
    }
}

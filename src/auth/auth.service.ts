import {Injectable} from '@nestjs/common';
import {UserRepository} from "./user.repository";
import {UserCreateDto} from "./dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository
    ) {}

    async signUp ( userCreateDto: UserCreateDto ) : Promise<void> {
        return this.userRepository.createUser(userCreateDto)
    }
}

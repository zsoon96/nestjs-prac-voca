import {Repository} from "typeorm";
import {User} from "./user.entity";
import {CustomRepository} from "../board/typeorm-custom.decorator";
import {UserCreateDto} from "./dto/create-user.dto";
import {ConflictException, InternalServerErrorException} from "@nestjs/common";

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    async createUser ( userCreateDto : UserCreateDto ) : Promise<void> {
        const { email, password, username, nickname, birth, phone } = userCreateDto
        const user = this.create ({ email, password, username, nickname,birth, phone })

        try {
            await this.save(user)
        }
        catch ( err ) {
            if ( err.errno === 1062) {
                throw new ConflictException('이미 존재하는 이메일입니다.')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
}
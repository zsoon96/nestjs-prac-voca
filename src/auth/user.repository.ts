import {Repository} from "typeorm";
import {User} from "./user.entity";
import {CustomRepository} from "../board/typeorm-custom.decorator";
import {UserCreateDto} from "./dto/create-user.dto";

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    async createUser ( userCreateDto : UserCreateDto ) : Promise<void> {
        const { email, password, username, nickname, birth, phone } = userCreateDto
        const user = this.create ({ email, password, username, nickname,birth, phone })

        await this.save(user)
    }
}
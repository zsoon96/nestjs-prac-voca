import {Repository} from "typeorm";
import {User} from "./user.entity";
import {CustomRepository} from "../board/typeorm-custom.decorator";

@CustomRepository(User)
export class UserRepository extends Repository<User> {

}
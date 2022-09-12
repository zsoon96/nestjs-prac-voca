import {EntityRepository, Repository} from "typeorm";
import {Board} from "./board.entity";
import {CustomRepository} from "./typeorm-custom.decorator";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {}
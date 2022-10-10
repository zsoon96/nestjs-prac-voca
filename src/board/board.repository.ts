import {Repository} from "typeorm";
import {Board} from "./board.entity";
import {CustomRepository} from "./typeorm-custom.decorator";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {

    async createBoard(board: Board) : Promise<Board> {
        await this.save(board)
        return board;
    }
}
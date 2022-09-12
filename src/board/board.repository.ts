import {EntityRepository, Repository} from "typeorm";
import {Board} from "./board.entity";
import {CustomRepository} from "./typeorm-custom.decorator";
import {CreateBoardDto} from "./dto/create-board.dto";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {

    async createBoard(createBoardDto : CreateBoardDto) : Promise<Board> {
        const { title, content } = createBoardDto

        const board = this.create({
            title,
            content
        })

        await this.save(board)
        return board
    }
}
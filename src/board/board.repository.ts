import {Repository} from "typeorm";
import {Board} from "./board.entity";
import {CustomRepository} from "./typeorm-custom.decorator";
import {CreateBoardDto} from "./dto/create-board.dto";
import {InternalServerErrorException} from "@nestjs/common";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {

    // async createBoard(board: Board) : Promise<Board> {
    //    await this.save(board)
    //    return board;
    // }

    async saveBoard(createBoardDto: CreateBoardDto) {
        const { title, content, author } = createBoardDto;

        const board = this.create({
            title,
            content,
            author
        })

        try {
            await this.save(board)
        } catch (err) {
            throw new InternalServerErrorException()
        }

        return board;
    }
}
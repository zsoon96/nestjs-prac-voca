import {Get, Injectable, NotFoundException} from '@nestjs/common';
import {BoardRepository} from "./board.repository";
import {Board} from "./board.entity";
import {CreateBoardDto} from "./dto/create-board.dto";

@Injectable()
export class BoardService {
    constructor(
        private boardRepository : BoardRepository
    ) {}

    async getAllBoard() : Promise<Board[]> {
        return await this.boardRepository.find()
    }

    async createBoard(createBoardDto : CreateBoardDto) : Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto)
    }

    async getBoardById( id: number) : Promise<Board> {
        const board = this.boardRepository.findOneBy({id})

        if (!board) {
            throw new NotFoundException('해당 게시글이 존재하지 않습니다.')
        }
        return board
    }

    async updateBoardById( id:number, title:string, content:string, author:string) : Promise<Board> {
        const board = await this.boardRepository.findOneBy({id})

        board.title = title;
        board.content = content;
        board.author = author;

        await this.boardRepository.save(board)

        return board
    }

    async deleteBoardById( id:number ) : Promise<void> {
        await this.boardRepository.delete(id)
    }
}

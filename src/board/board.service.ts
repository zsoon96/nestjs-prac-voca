import {Injectable, NotFoundException} from '@nestjs/common';
import {BoardRepository} from "./board.repository";
import {Board} from "./board.entity";
import {CreateBoardDto} from "./dto/create-board.dto";

// utc > kst 시간으로 변환해주는 메서드
const getDateTime = (utcTime) => {
    // setHours() 메서드를 활용하여 기존 시간에서 + 9한 시간으로 설정
    utcTime.setHours(utcTime.getHours() + 9)
    return utcTime.toISOString().replace('T', ' ').substring(0,16);
}

@Injectable()
export class BoardService {
    constructor(
        private boardRepository: BoardRepository
    ) {
    }

    async getAllBoard(): Promise<Board[]> {
        const board =  await this.boardRepository.find();

        // 등록 시간 변경
        board.map((board) => {
            board.regDate = getDateTime(board.regDate);
        })

        return board;
    }

    async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto)
    }

    async getBoardById(id: number): Promise<Board> {
        const board = await this.boardRepository.findOneBy({id})

        if (!board) {
            throw new NotFoundException('해당 게시글이 존재하지 않습니다.')
        }

        // 등록 시간 변경
        board.regDate = getDateTime(board.regDate);

        return board;
    }

    async updateBoardById(id: number, title: string, content: string, author: string): Promise<Board> {
        const board = await this.boardRepository.findOneBy({id})

        board.title = title;
        board.content = content;
        board.author = author;

        await this.boardRepository.save(board)

        // 등록 시간 변경
        board.regDate = getDateTime(board.regDate);

        return board
    }

    async deleteBoardById(id: number): Promise<void> {
        await this.boardRepository.delete(id)
    }
}

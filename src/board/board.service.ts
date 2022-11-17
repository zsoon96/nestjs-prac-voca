import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import {BoardRepository} from "./board.repository";
import {Board} from "./board.entity";
import {CreateBoardDto} from "./dto/create-board.dto";
import {Connection} from "typeorm";

// utc > kst 시간으로 변환해주는 메서드
const getDateTime = (utcTime) => {
    // setHours() 메서드를 활용하여 기존 시간에서 + 9한 시간으로 설정
    utcTime.setHours(utcTime.getHours() + 9)
    return utcTime.toISOString().replace('T', ' ').substring(0, 16);
}

@Injectable()
export class BoardService {
    constructor(
        private boardRepository: BoardRepository,
        private connection: Connection
    ) {
    }

    async getAllBoard(): Promise<Board[]> {
        const board = await this.boardRepository.find({
            order: {
                id: 'DESC'
            }
        });

        // 등록 시간 변경
        board.map((board) => {
            board.regDate = getDateTime(board.regDate);
        })

        return board;
    }

    async create(createBoardDto: CreateBoardDto) {
        console.log('controller', createBoardDto);
        const board = createBoardDto.toBoardEntity();
        await this.boardRepository.save(board);
        return board;
    }

    async createBoard2(createBoardDto: CreateBoardDto): Promise<Board> {
        return await this.boardRepository.saveBoard(createBoardDto)
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

    async updateBoardById(id: number, title: string, content: string, author: string) {
        // QueryRunner 생성
        const queryRunner = this.connection.createQueryRunner()

        // DB 연결
        await queryRunner.connect()
        // 트랜잭션 시작
        await queryRunner.startTransaction()

        try {
            // QueryRunner를 사용할 때는 manager를 통해 레포지토리를 가져와서 사용해야 트랜잭션이 적용됨!!!
            const board = await queryRunner.manager.getRepository(Board).findOneBy({id})

            board.title = title;
            board.content = content;
            board.author = author;

            await queryRunner.manager.getRepository(Board).save(board)

            // 등록 시간 변경
            board.regDate = getDateTime(board.regDate);

            // 테스트용 에러 발생
            // throw new InternalServerErrorException()

            // 정상 동작 수행 시 트랜잭션 커밋
            await queryRunner.commitTransaction()

            return board
        } catch (err) {
            // 에러 발생 시 롤백
            await queryRunner.rollbackTransaction()
        }finally {
            // queryRunner 객체 해제 (필수)
            await queryRunner.release()
        }
    }

    async deleteBoardById(id: number): Promise<void> {
        await this.boardRepository.delete(id)
    }
}

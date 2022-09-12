import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {BoardService} from "./board.service";
import {Board} from "./board.entity";
import {CreateBoardDto} from "./dto/create-board.dto";

@Controller('board')
export class BoardController {
    constructor(private boardService: BoardService) {}

    @Get()
    getAllBoard() : Promise<Board[]> {
        return this.boardService.getAllBoard()
    }

    @Post()
    createBoard(@Body() createBoardDto : CreateBoardDto) : Promise<Board> {
        return this.boardService.createBoard(createBoardDto)
    }

    @Get('/:id')
    getBoardById(@Param('id') id : number) : Promise<Board> {
        return this.boardService.getBoardById(id)
    }

    @Put(':/id')
    updateBoardById(
        @Param('id') id : number,
        @Body('title') title : string,
        @Body('content') content : string ) : Promise<Board> {
        return this.boardService.updateBoardById(id, title, content)
    }

    @Delete(':/id')
    deleteBoardById(id : number) : Promise<void> {
        return this.boardService.deleteBoardById(id)
    }

}

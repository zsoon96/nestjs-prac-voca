import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {CreateBoardDto} from "./dto/create-board.dto";

@Entity() // CREATE TABLE board
export class Board extends BaseEntity {

    // pk
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    author: string;

    @CreateDateColumn()
    regDate: Date;

    @CreateDateColumn()
    updateDate: Date;

    static from(
        title: string,
        content: string,
        author: string
    ) {
        const board = new Board();
        board.title = title;
        board.content = content;
        board.author = author;
        return board;
    }
}
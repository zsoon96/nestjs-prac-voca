import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

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

    @UpdateDateColumn()
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
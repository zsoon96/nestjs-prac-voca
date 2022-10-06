import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

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
}
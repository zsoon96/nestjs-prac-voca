import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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

}
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class BoardFile extends BaseEntity {

    @PrimaryGeneratedColumn()
    fileId: number;

    @Column()
    originalName: string;

    @Column()
    fileName: string;

    @Column()
    fileExt: string;

    @Column()
    filePath: string;

    @Column()
    fileSize: number;

}
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    email: string;

    @Column({
        nullable: true
    })
    password: string;

    @Column()
    username: string;

    @Column({
        nullable: true
    })
    nickname: string;

    @Column()
    birth: string;

    @Column({
        nullable: true
    })
    phone: string;

}
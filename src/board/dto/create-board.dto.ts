import {Board} from "../board.entity";
import {IsString} from "class-validator";

// 객체의 필드가 public으로 공개되거나 무분별한 getter/setter를 통해 접근성과 불변성이 보장되지 않으면 잠재적인 문제를 발생시킬 수 있음
// 캡슐화 보장
export class CreateBoardDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsString()
    author: string;

    // Service에서 해당 DTO의 필드 접근이 불가능해졌기 때문에
    // DTO에서 Entity로 변환해주는 메소드를 작성하여 활용
    toBoardEntity() {
        return Board.from(
            this.title,
            this.content,
            this.author
        )
    }
}
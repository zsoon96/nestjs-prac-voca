import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {User} from "./user.entity";

export const GetUser = createParamDecorator((data, ctx:ExecutionContext) : User => {
    // req에 모든 값 받기
    const req = ctx.switchToHttp().getRequest();
    // 그 중에서 user에 해당하는 값만 반환
    return req.user
})
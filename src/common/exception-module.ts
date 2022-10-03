import {RESPONSE_CODE, RESPONSE_MESSAGE} from "./exception-type";
import {HttpException} from "@nestjs/common";

export class NotFoundCustomException extends HttpException {
    constructor() {
        super(RESPONSE_MESSAGE.NOT_FOUND, RESPONSE_CODE.NOT_FOUND);
    }
}

export class BadRequestCustomException extends HttpException {
    constructor() {
        super(RESPONSE_MESSAGE.BAD_REQUEST, RESPONSE_CODE.BAD_REQUEST);
    }
}

export class FailRequestCustomException extends HttpException {
    constructor() {
        super(RESPONSE_MESSAGE.FAIL_REQUEST, RESPONSE_CODE.FAIL_REQUEST);
    }
}
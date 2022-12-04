export enum RESPONSE_CODE {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    FAIL_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export enum RESPONSE_MESSAGE {
    SUCCESS = '정상적으로 처리되었습니다.',
    BAD_REQUEST = '잘못된 요청입니다.',
    FAIL_REQUEST = '해당 요청에 대해 실패하였습니다.',
    NOT_FOUND = '해당 정보를 찾을 수 없습니다.',
    INTERNAL_SERVER_ERROR = '서버에서 알 수 없는 에러가 발생했습니다.'
}
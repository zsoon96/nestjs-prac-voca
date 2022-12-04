import { SetMetadata } from '@nestjs/common'

// @EntityRepository 대신 사용할 @CustomRepository 생성
export const TYPEORM_CUSTOM_REPOSITORY = 'TYPEORM_CUSTOM_REPOSITORY';

// SetMetadata를 이용해서 특정한 Token값으로 entity를 저장
export function CustomRepository(entity: Function): ClassDecorator {
    return SetMetadata(TYPEORM_CUSTOM_REPOSITORY, entity);
}
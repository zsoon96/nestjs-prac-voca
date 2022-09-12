import {DynamicModule, Provider} from "@nestjs/common";
import {TYPEORM_CUSTOM_REPOSITORY} from "./typeorm-custom.decorator";
import {getDataSourceToken} from "@nestjs/typeorm";
import {DataSource} from "typeorm";

// Custom한 Repository를 사용하기 위한 모듈 생성
export class CustomTypeOrmModule {
    public static forCustomRepository<T extends new (...args: any[]) => any>(repositories: T[]): DynamicModule {
        const providers: Provider[] = [];

        for (const repository of repositories) {
            // metadata token을 이용해서 엔티티 조회
            const entity = Reflect.getMetadata(TYPEORM_CUSTOM_REPOSITORY, repository);

            if (!entity) {
                continue;
            }

            // 공급자 설정
            providers.push({
                inject: [getDataSourceToken()], // getDataSourceToken()으로 DB 데이터 연결 얻기
                provide: repository,
                useFactory: (dataSource: DataSource): typeof repository => {
                    const baseRepository = dataSource.getRepository<any>(entity);
                    return new repository(baseRepository.target,
                        baseRepository.manager,
                        baseRepository.queryRunner)
                }
            })
        }

        return { exports: providers, module: CustomTypeOrmModule, providers}
    }
}
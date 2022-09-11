import {TypeOrmModuleOptions} from "@nestjs/typeorm";

export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root1234',
    database: 'voca',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    // true > 앱을 다시 실행할 때 엔티티안에서 수정된 컬럼의 길이 타입 변경값등을 해당 테이블 Drop 후 다시 생성하도록 설정
    synchronize: true
}
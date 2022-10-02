import {Module} from '@nestjs/common';
import {FileController} from './file.controller';
import {FileService} from './file.service';
import {CustomTypeOrmModule} from "../board/typeorm-custom.module";
import {VocaFileRepository} from "./file.repository";

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([VocaFileRepository])],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}

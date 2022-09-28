import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from './multer.options';

@Module({
  imports: [MulterModule.registerAsync({
    imports: [ConfigModule],
    useFactory: multerOptionsFactory,
    inject: [ConfigService]
  })],
  controllers: [FileController],
  providers: [FileService]
})
export class FileModule {}
import {Body, Controller, Post, UploadedFiles, UseInterceptors,} from '@nestjs/common';
import {FilesInterceptor} from '@nestjs/platform-express';
import {FileService} from './file.service';
import {CreateFileUploadDto} from "./dto/create-file.dto";


@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService) {
    }

    // 파일 업로드
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(
        @Body() createFileUploadDto: CreateFileUploadDto,
        @UploadedFiles() files: Express.MulterS3.File[]
    ) {
        const { type } = createFileUploadDto
        return this.fileService.uploadFile(files, type);
    }
}

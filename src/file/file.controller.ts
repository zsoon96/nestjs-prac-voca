import {
    Body,
    Controller,
    Delete,
    Get, Header,
    Param,
    Patch,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    Response
} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {FileService} from './file.service';
import {CreateFileUploadDto} from "./dto/create-file.dto";
import {UpdateFileUploadDto} from "./dto/update-file.dto";


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
        const {type} = createFileUploadDto;
        return this.fileService.uploadFile(files, type);
    }

    // 파일 업데이트 (단일)
    @Patch('update/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateFile(
        @Body() updateFileUploadDto: UpdateFileUploadDto,
        @UploadedFile() file: Express.MulterS3.File,
        @Param('id') fileId: number
    ) {
        const {type} = updateFileUploadDto;
        return this.fileService.updateFile(file, type, fileId);
    }

    // 파일 삭제 (단일)
    @Delete(':id')
    deleteFile(@Param('id') fileId: number) {
        return this.fileService.deleteFile(fileId)
    }

    // @Header(
    //     'Content-Disposition',
    //     'attachment;'
    // )

    @Get(':id')
    downloadFile(@Param('id') fileId: number, @Response() res) {
        return this.fileService.downloadFile(fileId, res)
    }

}

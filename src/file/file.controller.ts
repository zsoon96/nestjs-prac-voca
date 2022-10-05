import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    InternalServerErrorException,
    Logger,
    LoggerService,
    Param,
    Patch,
    Post,
    Response,
    UploadedFile,
    UploadedFiles,
    UseFilters,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {FileService} from './file.service';
import {CreateFileUploadDto} from "./dto/create-file.dto";
import {UpdateFileUploadDto} from "./dto/update-file.dto";
import {HttpExceptionFilter} from "../common/exception-filter";

@UseFilters(HttpExceptionFilter)
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService,
                @Inject(Logger) private readonly logger3: LoggerService) {
    }

    private printLoggerSeviceLog(res: any) {
        try {
            throw new InternalServerErrorException('test');
        } catch (e) {
            this.logger3.error('error: ' + JSON.stringify(res), e.stack);
            this.logger3.warn('warn: ' + JSON.stringify(res));
            this.logger3.log('log: ' + JSON.stringify(res));
            this.logger3.verbose('verbose: ' + JSON.stringify(res));
            this.logger3.debug('debug: ' + JSON.stringify(res));
        }
    }

    // 파일 업로드
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(
        @Body() createFileUploadDto: CreateFileUploadDto,
        @UploadedFiles() files: Express.MulterS3.File[]
    ) {
        this.printLoggerSeviceLog(createFileUploadDto);
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
        this.printLoggerSeviceLog(updateFileUploadDto);
        const {type} = updateFileUploadDto;
        return this.fileService.updateFile(file, type, fileId);
    }

    // 파일 삭제 (단일)
    @Delete(':id')
    deleteFile(@Param('id') fileId: number) {
        this.printLoggerSeviceLog(fileId);
        return this.fileService.deleteFile(fileId);
    }

    @Get(':id')
    downloadFile(@Param('id') fileId: number, @Response() res) {
        // this.printLoggerSeviceLog(fileId);
        // this.printLoggerSeviceLog(res);
        return this.fileService.downloadFile(fileId, res);
    }
}

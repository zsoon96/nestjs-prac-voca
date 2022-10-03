import {
    Body,
    Controller,
    Delete,
    Get, Inject, InternalServerErrorException, LoggerService,
    Param,
    Patch,
    Post,
    Response,
    UploadedFile,
    UploadedFiles, UseFilters,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {FileService} from './file.service';
import {CreateFileUploadDto} from "./dto/create-file.dto";
import {UpdateFileUploadDto} from "./dto/update-file.dto";
import {HttpExceptionFilter} from "../common/exception-filter";
import {WINSTON_MODULE_PROVIDER, WINSTON_MODULE_NEST_PROVIDER} from "nest-winston";
import { Logger as WinstonLogger } from "winston"

@UseFilters(HttpExceptionFilter)
@Controller('file')
export class FileController {
    constructor(private readonly fileService: FileService,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger : WinstonLogger,
                @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger2: LoggerService) {
    }

    // 파일 업로드
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFile(
        @Body() createFileUploadDto: CreateFileUploadDto,
        @UploadedFiles() files: Express.MulterS3.File[]
    ) {
        this.printWinstonLog(createFileUploadDto);
        const {type} = createFileUploadDto;
        return this.fileService.uploadFile(files, type);
    }

    private printWinstonLog(createFileUploadDto) {
        this.logger.error('error: ', createFileUploadDto)
        this.logger.warn('warn: ', createFileUploadDto)
        this.logger.info('info: ', createFileUploadDto)
        this.logger.http('http: ', createFileUploadDto)
        this.logger.verbose('verbose: ', createFileUploadDto)
        this.logger.debug('debug: ', createFileUploadDto)
        this.logger.silly('silly: ', createFileUploadDto)
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
        this.printLoggerSeviceLog(fileId);
        return this.fileService.deleteFile(fileId)
    }

    private printLoggerSeviceLog(fileId: number) {
        try {
            throw new InternalServerErrorException('test');
        } catch (e) {
            this.logger2.error('error: ' + JSON.stringify(fileId), e.stack);
            this.logger2.warn('warn: ' + JSON.stringify(fileId));
            this.logger2.log('log: ' + JSON.stringify(fileId));
            this.logger2.verbose('verbose: ' + JSON.stringify(fileId));
            this.logger2.debug('debug: ' + JSON.stringify(fileId));
        }
    }

    @Get(':id')
    downloadFile(@Param('id') fileId: number, @Response() res) {
        return this.fileService.downloadFile(fileId, res)
    }

}

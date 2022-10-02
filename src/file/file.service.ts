import {BadRequestException, Header, Injectable, NotFoundException, StreamableFile} from '@nestjs/common';
import * as AWS from 'aws-sdk'
import * as path from 'path'
import {VocaFileRepository} from "./file.repository";
import {randomUUID} from "crypto";
import { Response } from 'express';
import { createReadStream } from 'fs'


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
});

// 오늘 날짜 구하는 메서드
export function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (1 + date.getMonth())).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return year + '-' + month + '-' + day;
}

export function getTime() {
    const date = new Date();
    const hours = ('0' + date.getHours()).slice(-2);
    const min = ('0' + date.getMinutes()).slice(-2);
    const sec = ('0' + date.getSeconds()).slice(-2);
    const ms = ('0' + date.getMilliseconds()).slice(-2);

    return hours + min + sec + ms;
}

// export const uuid = randomUUID();

@Injectable()
export class FileService {
    constructor(
        private fileRepository: VocaFileRepository
    ) {
    }

    async uploadFile(files: Express.MulterS3.File[], type: string) {
        if (!files) {
            throw new NotFoundException('업로드 할 파일이 없습니다.')
        }

        files.map(async (file) => {
            const ext = path.extname(file.originalname) // 확장자명 추출
            const today = getToday();
            const time = getTime();

            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: file.buffer,
                Key: `${type}/${today}/${time}${ext}`,
            }

            // S3 업로드
            try {
                s3.putObject(uploadParams, function (error, data) {
                    if (error) {
                        console.log('err: ', error, error.stack);
                    } else {
                        console.log(data, " 정상 업로드 되었습니다.");
                    }
                })
            } catch (err) {
                console.log(err);
                throw new BadRequestException('파일 업로드에 실패하였습니다.');
            }

            // 업로드 된 파일 url 가져오기
            const getParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${type}/${today}/${time}${ext}`
            }

            const url: string = await new Promise((r) => s3.getSignedUrl('getObject', getParams, async (e, url) => {
                if (e) {
                    throw e;
                }
                r(url.split('?')[0]);
            }))

            const vocaFile = this.fileRepository.create({
                originalName: path.basename(file.originalname, ext),
                filePath: url,
                fileName: url.split('com/')[1],
                fileExt: path.extname(file.originalname),
                fileSize: file.size
            })

            console.log(vocaFile)

            // 파일 정보 DB에 저장
            await this.fileRepository.save(vocaFile)
        })

    }

    async updateFile(file: Express.MulterS3.File, type: string, fileId: number) {
        if (!file) {
            throw new NotFoundException('업로드 할 파일이 없습니다.')
        }

        const ext = path.extname(file.originalname) // 확장자명 추출
        const today = getToday();
        const time = getTime();

        // S3 업로드
        const updateParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: file.buffer,
            Key: `${type}/${today}/${time}${ext}`
        }

        try {
            s3.putObject(updateParam, function (error, data) {
                if (error) {
                    console.log('err: ', error, error.stack)
                } else {
                    console.log(data, '정상 업로드 되었습니다.')
                }
            })
        } catch (err) {
            console.log(err)
            throw new BadRequestException('업로드에 실패하였습니다.')
        }

        // 업로드 된 파일 URL 가져오기
        const getParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${type}/${today}/${time}${ext}`
        }

        const url: string = await new Promise((r) => s3.getSignedUrl('getObject', getParam, async (e, url) => {
            if (e) {
                throw e;
            }
            r(url.split('?')[0]);
        }))

        // 기존 파일 조회 후, S3 삭제
        const vocaFile = await this.fileRepository.findOneBy({fileId});

        const deleteParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: vocaFile.fileName
        }

        try {
            s3.deleteObject(deleteParam, function (error, data) {
                if (error) {
                    console.log('err: ', error)
                } else {
                    console.log(data, '정상 삭제되었습니다.')
                }
            })
        } catch (err) {
            console.log(err)
            throw new BadRequestException('파일 삭제에 실패하였습니다.')
        }

        // 기존 데이터에 파일 정보 변경 후 DB 저장
        vocaFile.originalName = path.basename(file.originalname, ext);
        vocaFile.filePath = url;
        vocaFile.fileName = url.split('com/')[1];
        vocaFile.fileExt = path.extname(file.originalname);
        vocaFile.fileSize = file.size

        await this.fileRepository.save(vocaFile);
    }

    async deleteFile(fileId: number) {
        // 기존 파일 조회
        const deleteFile = await this.fileRepository.findOneBy({fileId})

        if (!deleteFile) {
            throw new BadRequestException('파일이 존재하지 않습니다.');
        }

        // S3 파일 삭제
        const deleteParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: deleteFile.fileName,
        };

        console.log(deleteFile.fileName)

        try {
            s3.deleteObject(deleteParam, function (error, data) {
                if (error) {
                    console.log('err: ', error, error.stack);
                } else {
                    console.log(data, " 정상 삭제 되었습니다.");
                }
            })
        } catch (err) {
            console.log(err);
            throw new BadRequestException('파일 삭제에 실패하였습니다.');
        }

        // DB 정보 삭제
        await this.fileRepository.delete({fileId: fileId})
    }

    async downloadFile(fileId: number, res: Response) {

        const file = await this.fileRepository.findOneBy({fileId})

        const fileName = file.originalName + file.fileExt
        const downloadName = encodeURIComponent(`${fileName}`)

        const getParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.fileName,
        }

        s3.headObject(getParam, (err, data) => {
            if (err) {
                throw new NotFoundException('파일이 존재하지 않습니다.')
            } else {
                res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);
                s3.getObject(getParam).createReadStream()
                    .pipe(res);
            }
        })

        // const fileName = file.originalName + file.fileExt

        // const downloadName = encodeURIComponent(`${fileName}`)
        // res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);

        // const stream = s3.getObject(getParam).createReadStream()
        // return new StreamableFile(stream)
    }

}

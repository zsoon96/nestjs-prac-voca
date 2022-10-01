import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import * as AWS from 'aws-sdk'
import * as path from 'path'
import {randomUUID} from "crypto";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
});

// 오늘 날짜 구하는 메서드
export function getToday() {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (1+ date.getMonth())).slice(-2);
    const day = ('0' + date.getDay()).slice(-2);

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

export const uuid = randomUUID();

@Injectable()
export class FileService {
    // async uploadFile(file: Express.MulterS3.File) {
    //     if (!file) {
    //         throw new BadRequestException('파일이 존재하지 않습니다.');
    //     }
    //     const test = 'test'
    //     const uploadParams = {
    //         Bucket: process.env.AWS_BUCKET_NAME,
    //         Body: file.buffer,
    //         Key: `${test}/${Date.now()}`,
    //     };
    //
    //
    //     try {
    //         s3.putObject(uploadParams, function (error, data) {
    //             if (error) {
    //                 console.log('err: ', error, error.stack);
    //             } else {
    //                 console.log(data, " 정상 업로드 되었습니다.");
    //             }
    //         })
    //     } catch(err) {
    //         console.log(err);
    //         throw err;
    //     }
    //
    //     const params = {Bucket: process.env.AWS_BUCKET_NAME, Key:`${test}/1664465489735` }
    //     const url: string = await new Promise((r) => s3.getSignedUrl('getObject',params, async (e, url) => {
    //         if (e) {
    //             throw e;
    //         }
    //         r(url.split('?')[0]);
    //     }))
    //
    //     const originalFileName = file.originalname
    //     const fileSize = file.size
    //     const fileExt = path.extname(file.originalname)
    //     const fileName = url.substring(50, url.length)
    //     const filePath = url
    //
    //     return { file };
    // }

    async uploadFile(files: Express.MulterS3.File[], type: string) {
        if (!files) {
            throw new NotFoundException('업로드 할 파일이 없습니다.')
        }


        files.map((file) => {
            const ext = path.extname(file.originalname) // 확장자명 추출
            const today = getToday();
            const time = getTime();

            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: file.buffer,
                Key: `${type}/${today}/${time}_${uuid}${ext}`,
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
                throw err;
            }
        })


    }

    async deleteFile(file: Express.MulterS3.File) {
        if (!file) {
            throw new BadRequestException('파일이 존재하지 않습니다.');
        }
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: '57bc99e431916ec4bc062399e48d585d_1664285480629.jpeg',
        };

        try {
            s3.deleteObject(deleteParams, function (error, data) {
                if (error) {
                    console.log('err: ', error, error.stack);
                } else {
                    console.log(data, " 정상 삭제 되었습니다.");
                }
            })
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

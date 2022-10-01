import {BadRequestException, Injectable} from '@nestjs/common';
import * as AWS from 'aws-sdk'
import * as path from 'path'

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_BUCKET_REGION,
});

@Injectable()
export class FileService {
    async uploadFile(file: Express.MulterS3.File) {
        if (!file) {
            throw new BadRequestException('파일이 존재하지 않습니다.');
        }
        const test = 'test'
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Body: file.buffer,
            Key: `${test}/${Date.now()}`,
        };


        try {
            s3.putObject(uploadParams, function (error, data) {
                if (error) {
                    console.log('err: ', error, error.stack);
                } else {
                    console.log(data, " 정상 업로드 되었습니다.");
                }
            })
        } catch(err) {
            console.log(err);
            throw err;
        }

        const params = {Bucket: process.env.AWS_BUCKET_NAME, Key:`${test}/1664465489735` }
        const url: string = await new Promise((r) => s3.getSignedUrl('getObject',params, async (e, url) => {
            if (e) {
                throw e;
            }
            r(url.split('?')[0]);
        }))

        const originalFileName = file.originalname
        const fileSize = file.size
        const fileExt = path.extname(file.originalname)
        const fileName = url.substring(50, url.length)
        const filePath = url

        return { file };
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
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
}

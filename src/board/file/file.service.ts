import {BadRequestException, Injectable} from '@nestjs/common';
import * as AWS from 'aws-sdk'

const s3 = new AWS.S3({
    accessKeyId: 'AWS_SECRET_ACCESS_KEY',
    secretAccessKey: 'AWS_SECRET_ACCESS_KEY',
    region: 'AWS_BUCKET_REGION',
});

@Injectable()
export class FileService {
    uploadFile(file: Express.MulterS3.File) {
        if (!file) {
            throw new BadRequestException('파일이 존재하지 않습니다.');
        }
        const deleteParams = {
            Bucket: 'AWS_BUCKET_NAME',
            Key: '57bc99e431916ec4bc062399e48d585d_1664285480629.jpeg',
        };

        // return await s3.send(new DeleteBucketCommand(deleteParams));

        // try {
        //     return await s3.deleteObject(deleteParams).promise();
        // } catch (e) {
        //     console.log(e);
        // }

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

        return { file };
    }

}

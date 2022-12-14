import {Injectable} from '@nestjs/common';
import * as AWS from 'aws-sdk'
import * as path from 'path'
import {VocaFileRepository} from "./file.repository";
import {Response} from 'express';
import {
    BadRequestCustomException,
    FailRequestCustomException,
    NotFoundCustomException
} from "../common/exception-module";
import * as archiver from 'archiver';
import {PassThrough} from "stream";


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

const multiFilesStream = async (files) => {
    const archive = archiver('zip', {zlib: {level: 5}})

    for (const file of files) {
        const passthrough = new PassThrough();

        const getParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.filename
        }

        try {
            await s3.headObject(getParams).promise();
            console.log('파일 있음');

            try {
                await s3.getObject(getParams).createReadStream()
                    .pipe(passthrough)
                    .on('error', (err) => {
                        console.log(err)
                        return new BadRequestCustomException();
                    })
                archive.append(passthrough, {name: file.realname})

            } catch (err) {
                console.log('파일 읽기 실패')
                return new BadRequestCustomException();
            }

        } catch (err) {
            console.log('파일 없음');
            throw new BadRequestCustomException();
        }

        // const s3Check = new Promise(async (res, rej) => {
        //     await s3.getObject(getParams, (err, data) => {
        //         if (err) {
        //             rej(err)
        //         } else {
        //             res(data)
        //         }
        //     }).createReadStream().pipe(passthrough).on('error', (err) => {
        //         console.error(err);
        //         throw new BadRequestCustomException();
        //     })
        // })
        //
        // s3Check.then(() => {console.log('성공')}).catch((rej) => {console.log(rej)})
    }

    return archive;
}

@Injectable()
export class FileService {
    constructor(
        private fileRepository: VocaFileRepository
    ) {
    }

    async uploadFile(files: Express.MulterS3.File[], type: string) {
        if (!files || files.length === 0) {
            throw new NotFoundCustomException();
        }

        // 한글 파일명 인코딩
        files.map((file) => {
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        })

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
            // try {
            //     s3.putObject(uploadParams, function (error, data) {
            //         if (error) {
            //             console.log('err: ', error, error.stack);
            //         } else {
            //             console.log(data, " 정상 업로드 되었습니다.");
            //         }
            //     })
            // } catch (err) {
            //     console.log(err);
            //     throw new FailRequestCustomException()
            // }

            try {
                await s3.putObject(uploadParams).promise();
            } catch (err) {
                console.log('S3 업로드 에러 발생', err);
                throw new FailRequestCustomException();
            }

            // 업로드 된 파일 있는지 확인 후, url 가져오기
            const getParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${type}/${today}/${time}${ext}`
            }

            // const url: string = await new Promise((r) => s3.getSignedUrl('getObject', getParams, async (e, url) => {
            //     if (e) {
            //         throw e;
            //     }
            //     r(url.split('?')[0]);
            // }))

            // S3에 파일이 있는지 확인
            try {
                const fileCheckS3 = await s3.headObject(getParams).promise();
                console.log('해당 파일 있음', fileCheckS3);
            } catch (err) {
                throw new NotFoundCustomException();
            }

            // 해당 객체가 존재하지 않을 때, 콜백(err, url 인수 포함)이 오류를 반환하지 않으며, url에 엑세스 했을 경우 'NoSuchObject'라고 표시됨
            const url: string = await new Promise(function (resolve, reject) {
                s3.getSignedUrl('getObject', getParams, (err, url) => {
                    if (err) {
                        reject(new BadRequestCustomException());
                    } else {
                        resolve(url.split('?')[0]);
                    }
                })
            })

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
            throw new NotFoundCustomException()
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
            await s3.putObject(updateParam).promise();
        } catch (err) {
            console.log('S3 업로드 에러 발생', err);
            throw new FailRequestCustomException()
        }

        // 업로드 된 파일 URL 가져오기
        const getParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${type}/${today}/${time}${ext}`
        }

        // S3에 파일이 있는지 확인
        try {
            await s3.headObject(getParam).promise();
            console.log('해당 파일 있음')
        } catch (err) {
            throw new NotFoundCustomException();
        }

        const url: string = await new Promise(function (resolve, reject) {
            s3.getSignedUrl('getObject', getParam, (err, url) => {
                if (err) {
                    reject(new BadRequestCustomException());
                } else {
                    resolve(url.split('?')[0]);
                }
            })
        })

        // const url: string = await new Promise((r) => s3.getSignedUrl('getObject', getParam, async (e, url) => {
        //     if (e) {
        //         throw e;
        //     }
        //     r(url.split('?')[0]);
        // }))

        // 기존 파일 조회 후, S3 삭제
        const vocaFile = await this.fileRepository.findOneBy({fileId});

        if (!vocaFile) {
            throw new NotFoundCustomException()
        }

        const deleteParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: vocaFile.fileName
        }

        try {
            await s3.deleteObject(deleteParam).promise();
            console.log('해당 파일 삭제')
        } catch (err) {
            console.log('S3 삭제 에러 발생', err)
            throw new FailRequestCustomException();
        }

        // try {
        //     s3.deleteObject(deleteParam, function (error, data) {
        //         if (error) {
        //             console.log('err: ', error)
        //         } else {
        //             console.log(data, '정상 삭제되었습니다.')
        //         }
        //     })
        // } catch (err) {
        //     console.log(err)
        //     throw new FailRequestCustomException()
        // }

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
            throw new NotFoundCustomException()
        }

        // S3 파일 삭제
        const deleteParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: deleteFile.fileName,
        };

        try {
            await s3.deleteObject(deleteParam).promise();
            console.log('해당 파일 삭제')
        } catch (err) {
            console.log('S3 삭제 에러 발생', err)
            throw new FailRequestCustomException();
        }

        // try {
        //     s3.deleteObject(deleteParam, function (error, data) {
        //         if (error) {
        //             console.log('err: ', error, error.stack);
        //         } else {
        //             console.log(data, " 정상 삭제 되었습니다.");
        //         }
        //     })
        // } catch (err) {
        //     console.log(err);
        //     throw new FailRequestCustomException()
        // }

        // DB 정보 삭제
        await this.fileRepository.delete({fileId: fileId})
    }

    // async downloadFile(fileId: number, res: Response) {
    //
    //     const file = await this.fileRepository.findOneBy({fileId})
    //
    //     if (!file) {
    //         throw new NotFoundCustomException()
    //     }
    //
    //     const fileName = file.originalName + file.fileExt
    //     const downloadName = encodeURIComponent(`${fileName}`)
    //
    //     const getParam = {
    //         Bucket: process.env.AWS_BUCKET_NAME,
    //         Key: file.fileName,
    //     }
    //
    //     try {
    //         await s3.headObject(getParam, async (err, data) => {
    //             try {
    //                 if (err) {
    //                     // 비동기 함수 예외처리
    //                     // res.status(200).json({message: 'S3에 파일이 존재하지 않습니다.', statusCode: err.statusCode, err: err.code});
    //                     throw new NotFoundCustomException()
    //                 } else {
    //                     res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);
    //                     await s3.getObject(getParam).createReadStream()
    //                         .pipe(res);
    //                     console.log(data, '정상적으로 처리되었습니다.');
    //                 }
    //             } catch (err) {
    //                 console.error(err);
    //             }
    //         })
    //     } catch (err) {
    //         console.log(err);
    //         throw new FailRequestCustomException();
    //     }
    //
    //     // const fileName = file.originalName + file.fileExt
    //
    //     // const downloadName = encodeURIComponent(`${fileName}`)
    //     // res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);
    //
    //     // const stream = s3.getObject(getParam).createReadStream()
    //     // return new StreamableFile(stream)
    // }

    // 다운로드 로직 > throw Exception 처리 가능하도록 수정
    async downloadFile(fileId: number, res: Response) {

        const file = await this.fileRepository.findOneBy({fileId});

        if (!file) {
            throw new NotFoundCustomException()
        }

        const fileName = file.originalName + file.fileExt
        const downloadName = encodeURIComponent(`${fileName}`)

        const getParam = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.fileName,
        }

        try {
            await s3.headObject(getParam).promise(); // promise()를 통해 해당 메서드를 프로미스 객체화시킴
            res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);

            try {
                await s3.getObject(getParam).createReadStream()
                    // pipe()를 통해 데이터를 res 객체로 전달
                    .pipe(res)
                    // stream도 비동기 함수이기 때문에 on()를 통해 별도 예외처리 추가 (이벤트 리스너 활용)
                    .on('error', (err) => {
                        console.log(err);
                        return new BadRequestCustomException()
                    })
                console.log('정상적으로 처리되었습니다.')

            } catch (err) {
                console.log('파일 읽기 실패')
                return new BadRequestCustomException();
            }

        } catch (err) {
            throw new NotFoundCustomException();
        }
    }

    async downloadZipFile(res: Response) {
        const files = [
            {
                path: 'https://voca-test.s3.ap-northeast-2.amazonaws.com/voca/2022-10-09/18104889.jpeg',
                filename: 'voca/2022-10-09/18104889.jpeg',
                realname: 'flying dog.jpeg'
            },
            {
                path: 'https://voca-test.s3.ap-northeast-2.amazonaws.com/voca/2022-10-09/18053886.jpeg',
                filename: 'voca/2022-10-09/18053886.jpeg',
                realname: 'bread dog.jpeg'
            },
            {
                path: 'https://voca-test.s3.ap-northeast-2.amazonaws.com/voca/2022-10-09/18053884.jpeg',
                filename: 'voca/2022-10-09/18053884.jpeg',
                realname: '한글이면?.jpeg'
            }
        ];

        const downloadName = getTime() + '.zip';
        res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);

        const mfStream = await multiFilesStream(files);
        mfStream.pipe(res);
        mfStream.finalize();
    }
}

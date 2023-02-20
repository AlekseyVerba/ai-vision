import { Injectable } from "@nestjs/common";
import * as sharp from 'sharp'
import { FileUpload } from "src/types/file/file";
import { Stream } from "stream";
import { promises, existsSync, mkdirSync, createWriteStream, } from 'fs'
import { join } from "path";
import { v4 as uuidv4 } from 'uuid';
import { BufferList } from 'bl'

@Injectable()
export class FileService {
    pathDir: string

    constructor() {
        this.pathDir = join(process.cwd(), '..', 'assets')
    }

    async uploadFileStream({
        file,
        dir
    }: { file: { stream: Stream, filename: string }, dir: string }): Promise<string> {

        const type = file.filename.split('.').pop()
        const newNameFile = uuidv4()

        const fullPathDir = join(this.pathDir, dir)

        if (!existsSync(fullPathDir)) {
            mkdirSync(fullPathDir, { recursive: true });
        }

        const fullPathFile = join(fullPathDir, `${newNameFile}.${type}`)

        return new Promise((resolve, reject) => {
          file.stream.pipe(createWriteStream(fullPathFile))
            .on('finish', () => {
                resolve(join(dir, `${newNameFile}.${type}`))
            })
            .on('error', reject);
        });
  

    }

    async uploadFile({
        file,
        dir
    }: { file: { buff: Buffer, filename: string }, dir: string }) {
        try {
            const type = file.filename.split('.').pop()
            const newNameFile = uuidv4()

            const fullPathDir = join(this.pathDir, dir)

            if (!existsSync(fullPathDir)) {
                mkdirSync(fullPathDir, { recursive: true });
            }

            const fullPathFile = join(fullPathDir, `${newNameFile}.${type}`)

            await promises.writeFile(fullPathFile,file.buff)

            return join(dir, `${newNameFile}.${type}`)
        } catch (error) {
            console.log(error);
        }
    }


    async deleteFile(avatarPath: string) {
        try {
            const fullPathFile = join(this.pathDir, avatarPath)

            if (existsSync(fullPathFile)) {
                promises.unlink(fullPathFile)
            }

        } catch (error) {
            console.log(error);
        }
    }

    getBufferFromRead(file: FileUpload): Promise<Buffer> {
        return new Promise((res, rej) => {
            const fileStream = file.createReadStream();
            const bufferList = new BufferList();

            fileStream.on('data', chunk => {
                bufferList.append(chunk);
            });

            fileStream.on('end', () => {
                const buffer = bufferList.slice();
                res(buffer)
            });
        })
    }


    async createResizedImage(
        file: {
            buff: Buffer, filename: string
        },
        dir: string,
        quality: number,
        resizeOptions: { width?: number, height?: number, options?: sharp.ResizeOptions },

    ) {
        try {
            const newNameFile = uuidv4()

            await sharp(file.buff)
                .jpeg({ quality })
                .resize(resizeOptions)
                .toFile(join(this.pathDir, dir, newNameFile + '.jpg'), (err, inf) => {
                    console.log(err)
                    console.log(inf)
                })
            return join(dir, newNameFile + '.jpg') 
        } catch (err) {
            console.log(err)
        }
    }
}


import { Inject, Injectable } from "@nestjs/common";
import * as sharp from 'sharp'
import { FileUpload } from "src/types/file/file";
import { Stream } from "stream";
import { promises, existsSync, mkdirSync, createWriteStream, createReadStream, readFileSync, writeFileSync } from 'fs'
import { join } from "path";
import { v4 as uuidv4 } from 'uuid';
import { BufferList } from 'bl'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver'
import * as AdmZip from "adm-zip";
@Injectable()
export class FileService {
    pathDir: string

    constructor(
        @Inject('JSZIP')
        private readonly jszip: JSZip,
    ) {
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

            await promises.writeFile(fullPathFile, file.buff)

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

    createZIPWithFiles({
        files,
        uid
    }: { files: Promise<FileUpload>[], uid: string }) {
        console.log('tttt')
        const nameZip = `${uuidv4()}.zip`
        const zip = new AdmZip();
        const dir = `user/${uid}/projects`

        const fullPathDir = join(this.pathDir, dir)

        if (!existsSync(fullPathDir)) {
            mkdirSync(fullPathDir, { recursive: true });
        }

        Promise.all(files.map(async file => {
            const { createReadStream, filename } = await file;
           
            const stream = createReadStream();
            console.log(stream)
            const buffer = await new Promise<Buffer>((resolve, reject) => {
              const chunks: Buffer[] = [];
              stream.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
              });
              stream.on('end', () => {
                console.log('ttt')
                resolve(Buffer.concat(chunks));
              });
              stream.on('error', (error: any) => {
                reject(error);
              });
            });

            const type = filename.split('.').pop()
            const newNameFile = `${uuidv4()}.${type}`

            zip.addFile(newNameFile, buffer);
        })).then(() => zip.writeZip(join(fullPathDir, nameZip)))
            .catch(err => console.log(err))

        return join(dir,nameZip)
    }
}


import { Module } from "@nestjs/common";

//SERVICES
import { FileService } from './file.service'

@Module({
    providers: [FileService],
    exports: [FileService]
})
export class FileModule {}
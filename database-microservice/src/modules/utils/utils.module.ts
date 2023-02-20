import { Module } from "@nestjs/common";

//SERVICES
import { UtilsService } from './utils.service'

@Module({
    providers: [UtilsService],
    exports: [UtilsService]
})
export class UtilsModule {}
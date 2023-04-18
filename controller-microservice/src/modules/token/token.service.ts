import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

//INPUT TYPES
import { ResendTokenInput } from './inputTypes/resend-token.input'
import { lastValueFrom } from "rxjs";

@Injectable()
export class TokenService {
    constructor(
        @Inject('DB_MICROSERVICE') private client: ClientProxy,
    ) {}

    async resendToken(dto: ResendTokenInput) {
        return await lastValueFrom(this.client.send('resend-token', dto));
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class CategoryService {
    constructor(
        @Inject('DB_MICROSERVICE') private client: ClientProxy,
    ) {}

    async getCategoryById(id: number) {
        return lastValueFrom(this.client.send('get-category-by-id', id))
    }

    async getAllCategories() {
        return lastValueFrom(this.client.send('get-all-categories', {}))
    }
}
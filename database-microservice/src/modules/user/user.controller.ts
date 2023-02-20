import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

//SERVICES
import { UserService } from './user.service'

//DTOS
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @MessagePattern('get-user-avatars')
    async getUserAvatars(uid: string) {
        return this.userService.getUserAvatars(uid)
    }

    @MessagePattern('update-user')
    async updateUser(dto: UpdateUserDto) {
        return this.userService.updateUser(dto)
    }

    @MessagePattern('get-user-by-uid')
    async getUserByUid(uid: string) {
        return this.userService.getUserByUid(uid)
    }

    @MessagePattern('get-user-by-name')
    async getUserByName(name: string) {
        return this.userService.getUserByName(name)
    }

    @MessagePattern('get-user-by-email')
    async getUserByEmail(email: string) {
        return this.userService.getUserByEmail(email)
    }
}
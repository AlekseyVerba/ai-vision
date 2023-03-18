import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

//SERVICES
import { UserService } from './user.service';

//DTO
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern('message.update-password')
  updatePassword(dto: UpdatePasswordDto) {
    this.userService.updatePassword(dto);
  }
}

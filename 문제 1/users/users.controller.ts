import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }
}

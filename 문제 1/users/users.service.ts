import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup(dto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, name } = dto;

    const alreadyUser = await this.userRepository.findOne({ where: { email } });

    if (alreadyUser) {
      throw new ConflictException('Email already exists');
    }

    const data = {
      email,
      password: await bcrypt.hash(password, 10),
      name,
    };

    const user = this.userRepository.create(data);
    const createDoc = await this.userRepository.save(user);

    return UserResponseDto.toResponse(createDoc);
  }
}

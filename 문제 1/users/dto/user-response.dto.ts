import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.createdAt = data.createdAt;
  }

  static toResponse(data: User) {
    return new UserResponseDto(data);
  }
}

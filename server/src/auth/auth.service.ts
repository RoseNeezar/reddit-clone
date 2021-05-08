import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { UserRepository } from 'src/entities/user/user.repository';
import { AuthCredentialDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {}

  async register(authCredentialDto: AuthCredentialDto) {
    const { email, password, username } = authCredentialDto;

    const emailUser = await this.userRepo.findOne({ email });
    const usernameUser = await this.userRepo.findOne({ username });

    if (emailUser) {
      throw new ConflictException('Email already exists');
    }
    if (usernameUser) {
      throw new ConflictException('Username already exists');
    }
    try {
      const user: Partial<User> = {
        username,
        email,
        password,
      };
      const result = await this.userRepo.create(user).save();

      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}

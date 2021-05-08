import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { User } from 'src/entities/user/user.entity';
import { AuthCredentialDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<Partial<User>> {
    return this.authService.register(authCredentialDto);
  }
}

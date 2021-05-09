import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import UserEntity from 'src/entities/user/user.entity';
import { AuthCredentialDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(
    @Body(ValidationPipe) authCredentialDto: AuthCredentialDto,
  ): Promise<Partial<UserEntity>> {
    return this.authService.register(authCredentialDto);
  }

  @Post('/login')
  login(
    @Res() res: Response,
    @Body(ValidationPipe) authCredentialDto: Omit<AuthCredentialDto, 'email'>,
  ): Promise<any> {
    return this.authService.login(authCredentialDto, res);
  }

  @Post('/logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  me(@GetUser() user: UserEntity) {
    return user;
  }
}

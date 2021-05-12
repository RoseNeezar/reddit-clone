import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import JwtAuthGuard from 'src/auth/guard/JwtAuthGuard';
import UserEntity from 'src/entities/user/user.entity';
import { CreateSubDto } from './sub.dto';
import { SubsService } from './subs.service';

@Controller('/api/subs')
export class SubsController {
  constructor(private subsService: SubsService) {}

  @Post('/')
  @UseGuards(AuthGuard())
  createSub(
    @Body(ValidationPipe) createSub: CreateSubDto,
    @GetUser() user: UserEntity,
  ) {
    return this.subsService.createSub(createSub, user);
  }

  @Get('/:name')
  @UseGuards(JwtAuthGuard)
  getSub(@Param() name: { name: string }, @GetUser() user: UserEntity) {
    return this.subsService.getSub(name.name, user);
  }
}

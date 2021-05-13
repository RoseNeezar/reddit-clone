import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetUser } from 'src/auth/get-user.decorator';
import JwtAuthGuard from 'src/auth/guard/JwtAuthGuard';
import UserEntity from 'src/entities/user/user.entity';
import { editFileName, imageFileFilter } from 'src/utils/subFileUpload';
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

  @Get('/top/subs')
  topSub() {
    return this.subsService.topSubs();
  }

  @Get('/:name')
  @UseGuards(JwtAuthGuard)
  getSub(@Param() name: { name: string }, @GetUser() user: UserEntity) {
    return this.subsService.getSub(name.name, user);
  }

  @Post('/:name/image')
  @UseGuards(AuthGuard())
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadSubImage(
    @Param() name: { name: string },
    @GetUser() user: UserEntity,
    @Body() type: { type: string },
    @UploadedFile() file: any,
  ) {
    return this.subsService.uploadSubImage(name.name, user, type.type, file);
  }
}

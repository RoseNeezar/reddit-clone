import { Module } from '@nestjs/common';
import { SubsController } from './subs.controller';
import { SubsService } from './subs.service';

@Module({
  controllers: [SubsController],
  providers: [SubsService]
})
export class SubsModule {}

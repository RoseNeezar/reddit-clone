import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class authValidationPipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata) {
    return value;
  }
}

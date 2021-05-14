import { IsNumber } from 'class-validator';

export class GetPaginatedPostParamDto {
  @IsNumber()
  page: number;

  @IsNumber()
  count: number;

  constructor(page: number, count: number) {
    this.page = page;
    this.count = count;
  }
}

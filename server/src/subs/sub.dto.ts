import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  constructor(title: string, name: string, description: string) {
    this.title = title;
    this.name = name;
    this.description = description;
  }
}

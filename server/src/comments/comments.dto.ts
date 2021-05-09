import { IsNotEmpty, IsString } from 'class-validator';

export class GetPostParamDto {
  @IsString()
  identifier: string;

  @IsString()
  slug: string;

  constructor(identifier: string, slug: string) {
    this.identifier = identifier;
    this.slug = slug;
  }
}

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsString()
  sub: string;

  constructor(title: string, body: string, sub: string) {
    this.title = title;
    this.body = body;
    this.sub = sub;
  }
}

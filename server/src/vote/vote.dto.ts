import { IsNumber, IsOptional, IsString } from 'class-validator';

export class VoteDto {
  @IsString()
  identifier: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  commentIdentifier: string;

  @IsNumber()
  value: number;

  constructor(
    identifier: string,
    slug: string,
    commentIdentifier: string,
    value: number,
  ) {
    this.identifier = identifier;
    this.slug = slug;
    this.commentIdentifier = commentIdentifier;
    this.value = value;
  }
}

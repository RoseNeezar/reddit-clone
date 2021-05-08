import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  constructor(email: string, username: string, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }
}

export interface TokenPayload {
  userId: number;
}

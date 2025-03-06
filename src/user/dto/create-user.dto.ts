import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  account: string;

  @IsString()
  googleId?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;
}

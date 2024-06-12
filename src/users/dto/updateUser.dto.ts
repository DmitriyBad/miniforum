import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUsersDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly bio: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly image: string;
}

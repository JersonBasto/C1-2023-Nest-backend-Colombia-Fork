import { IsEmail, IsNumberString, IsString } from 'class-validator';

export class UserGoogle {
  idFireBase: string;
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  phone?: string;
}

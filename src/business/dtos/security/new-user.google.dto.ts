import { IsEmail, IsNumberString, IsString } from 'class-validator';

export class UserGoogle {
  idFirebase: string;
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  phone?: string;
}

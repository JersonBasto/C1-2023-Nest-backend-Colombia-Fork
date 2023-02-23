import { IsEmail, IsNumberString, IsString } from 'class-validator';

export class UserGoogle {
  @IsString()
  idFireBase: string;
  @IsString()
  fullName: string;
  @IsString()
  email: string ;
  @IsString()
  documentType?: string;
  @IsString()
  document?: string;
  @IsString()
  phone?: string;
}

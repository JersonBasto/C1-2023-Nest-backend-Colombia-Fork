import {
  IsEmail,
  IsNumberString,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class newCustomerDTO {
  @IsString()
  documentType: string;
  @IsNumberString()
  document: string;
  @IsString()
  fullName: string;
  @IsEmail()
  email: string;
  @IsNumberString()
  phone: string;
  @Matches(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
  password: string;
}

import { IsNumber, IsString, IsUUID } from 'class-validator';
import { AccountTypeEntity } from 'src/data';
export class NewAccountDTO {
  @IsUUID()
  customer: string;
  accountType: AccountTypeEntity;
  @IsNumber()
  balance: number;
}

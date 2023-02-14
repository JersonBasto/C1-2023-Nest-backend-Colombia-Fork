import {
    IsNumber,
    IsString,
    IsUUID,
} from 'class-validator';
export class NewAccountDTO {
    @IsUUID()
    customer: string;
    @IsString()
    accountType: string;
    @IsNumber()
    balance: number;
}
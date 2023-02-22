import {
    IsNumber,
    IsDate,
    IsUUID,
    IsString,
    IsPositive
} from 'class-validator';
export class NewDepositDTO {
    @IsUUID()
    account: string;
    @IsNumber()
    @IsPositive()
    amount = 0;
}
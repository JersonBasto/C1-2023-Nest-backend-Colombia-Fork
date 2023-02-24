import {
    IsNumber,
    IsDate,
    IsUUID,
    IsString,
    IsNumberString,
    IsPositive
} from 'class-validator';
export class NewTransferDTO {
    @IsUUID()
    outcome: string;
    @IsUUID()
    income: string;
    @IsPositive()
    @IsNumber()
    amount: number;
    @IsString()
    reason: string;
}
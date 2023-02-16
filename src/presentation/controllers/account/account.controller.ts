import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AccountEntity, AccountTypeEntity } from 'src/data/persistence';
import { AccountService } from 'src/business/services';
import { NewAccountDTO } from 'src/business/dtos';

@Controller('account')
export class AccountController {
  constructor(private readonly accountServices: AccountService) {}
  @Get()
  getAccounts(): AccountEntity[] {
    return this.accountServices.findAll();
  }

  @Get(':id')
  getAccount(@Param('id', new ParseUUIDPipe()) id: string): AccountEntity {
    return this.accountServices.findOneById(id);
  }

  @Post()
  createAccount(@Body() account: NewAccountDTO): AccountEntity {
    return this.accountServices.createAccount(account);
  }

  @Post('verifiAmount/:id')
  verifyAmount(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() amount: { amount: number },
  ): boolean {
    return this.accountServices.verifyAmountIntoBalance(id, amount.amount);
  }

  @Post('/changeState/:id')
  changeState(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() state: { state: boolean },
  ): AccountEntity {
    return this.accountServices.changeState(id, state.state);
  }

  @Post('/createAccountType')
  createAccounType(@Body() body: { name: string }): AccountTypeEntity {
    return this.accountServices.createTypeAccount(body.name);
  }

  @Put('/changeAccountType/:id')
  changeAccountType(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() accountTypeId: { id: 'string' },
  ): AccountTypeEntity {
    console.log(accountTypeId.id);
    return this.accountServices.changeAccountType(id, accountTypeId.id);
  }

  @Put('/addBalance/:id')
  addBalance(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() amount: { amount: number },
  ): AccountEntity {
    return this.accountServices.addBalance(id, amount.amount);
  }

  @Put('/removeBalance/:id')
  removeBalance(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() amount: { amount: number },
  ): AccountEntity {
    return this.accountServices.removeBalance(id, amount.amount);
  }

  @Put(':id')
  modifyAccount(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() account: NewAccountDTO,
  ): AccountEntity {
    return this.accountServices.updateAccount(id, account);
  }

  @Delete(':id')
  deleteAccount(@Param('id', new ParseUUIDPipe()) id: string): void {
    return this.accountServices.deleteAccount(id);
  }
}

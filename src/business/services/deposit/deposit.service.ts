import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { DataRangeModel, PaginationModel } from 'src/data/models';
import {
  AccountEntity,
  DepositEntity,
  DepositRepository,
} from 'src/data/persistence';
import { NewDepositDTO } from 'src/business/dtos';
import { AccountService } from '../account';

@Injectable()
export class DepositService {
  constructor(
    private readonly depositRepository: DepositRepository,
    private readonly accountService: AccountService,
  ) {}
  /**
   * Crear un deposito
   *
   * @param {DepositModel} deposit
   * @return {*}  {DepositEntity}
   * @memberof DepositService
   */
  createDeposit(deposit: NewDepositDTO): DepositEntity {
    const newDeposit = new DepositEntity();
    const newAccount = this.accountService.findOneById(deposit.account);
    //this.accountService.getState(deposit.account) ??
    if (this.accountService.getState(deposit.account)) {
      newDeposit.amount = deposit.amount;
      newDeposit.dateTime = Date.now();
      newAccount.id = deposit.account;
      newDeposit.account = newAccount;
      this.accountService.addBalance(deposit.account, deposit.amount);
      return this.depositRepository.register(newDeposit);
    } else {
      throw new NotFoundException('La cuenta no se encuentra activa');
    }
  }

  findOneById(id: string): DepositEntity {
    return this.depositRepository.findOneById(id);
  }

  /**
   * Borrar un deposito
   *
   * @param {string} depositId
   * @memberof DepositService
   */
  deleteDeposit(depositId: string): void {
    const deposit = this.depositRepository.findOneById(depositId);
    if (deposit.deletedAt === undefined) {
      this.depositRepository.delete(depositId, true);
    } else {
      this.depositRepository.delete(depositId, false);
    }
  }

  /**
   * Obtener el historial de los depósitos en una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {DepositEntity[]}
   * @memberof DepositService
   */
  getHistory(
    accountId: string,
    pagination: PaginationModel,
    dataRange?: DataRangeModel,
  ): DepositEntity[] {
    const arrayTransfer = this.depositRepository.findByDateRange(
      accountId,
      0,
      Date.now(),
    );
    const arrayTransferReturn: DepositEntity[] = [];
    let range = 0;
    pagination.size = arrayTransfer.length;
    if (dataRange?.range === undefined) {
      range = 10;
    } else {
      range = dataRange.range;
    }
    pagination.numberPages = Math.round(pagination.size / range);
    for (
      let x = 1 + range * (pagination.actualPage - 1);
      x < 1 + range + range * (pagination.actualPage - 1);
      x++
    ) {
      arrayTransferReturn.push(arrayTransfer[x - 1]);
    }
    return arrayTransferReturn;
  }
  /**
   *
   * Se actualiza el deposito
   *
   * @param id
   * @param deposit
   * @returns
   */
  updateDeposit(id: string, deposit: NewDepositDTO): DepositEntity {
    const findDeposit = this.depositRepository.findOneById(id);
    if (findDeposit) {
      const newDeposit = new DepositEntity();
      const newAccount = new AccountEntity();
      newAccount.id = deposit.account;
      newDeposit.amount = deposit.amount;
      newDeposit.account = newAccount;
      return this.depositRepository.update(id, newDeposit);
    } else {
      throw new NotFoundException('No se encuentra con ese ID');
    }
  }

  findAll(): DepositEntity[] {
    return this.depositRepository.findAll();
  }
  findByCustomerId(id: string): DepositEntity[] {
    return this.depositRepository.findByCustomerId(id);
  }
}

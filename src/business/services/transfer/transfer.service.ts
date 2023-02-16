import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataRangeModel, PaginationModel } from 'src/data/models';
import {
  AccountEntity,
  TransferEntity,
  TransferRespository,
} from 'src/data/persistence';
import { NewTransferDTO } from 'src/business/dtos';
import { AccountService } from '../account';

@Injectable()
export class TransferService {
  constructor(
    private readonly transferRepository: TransferRespository,
    private readonly accountService: AccountService,
  ) {}
  /**
   * Crear una transferencia entre cuentas del banco
   *
   * @param {TransferModel} transfer
   * @return {*}  {TransferEntity}
   * @memberof TransferService
   */
  createTransfer(transfer: NewTransferDTO): TransferEntity {
    let newTransfer = new TransferEntity();
    const newOutcome = this.accountService.findOneById(transfer.outcome);
    const newIncome = this.accountService.findOneById(transfer.income);
    const incomeAccount = this.accountService.getState(transfer.income);
    const outcomeAccount = this.accountService.getState(transfer.outcome);
    ///Se deja por ahora en true y true para probar su implementacion.
    if (incomeAccount && outcomeAccount) {
      //this.accountService.getBalance(transfer.outcome)
      //Se deja asi para que pase
      if (this.accountService.getBalance(transfer.outcome) >= transfer.amount) {
        newTransfer.outcome = newOutcome;
        newTransfer.income = newIncome;
        newTransfer.amount = transfer.amount;
        newTransfer.reason = transfer.reason;
        this.accountService.addBalance(newIncome.id, transfer.amount);
        this.accountService.removeBalance(newOutcome.id, transfer.amount);
        return this.transferRepository.register(newTransfer);
      } else {
        throw new InternalServerErrorException();
      }
    } else {
      throw new InternalServerErrorException();
    }
  }

  /**
   * Obtener historial de transacciones de salida de una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  getHistoryOut(
    accountId: string,
    pagination: PaginationModel,
    dataRange?: DataRangeModel,
  ): TransferEntity[] {
    const arrayTransfer = this.transferRepository.findByOutcomeId(accountId);
    const arrayTransferReturn: TransferEntity[] = [];
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
   * Obtener historial de transacciones de entrada en una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  getHistoryIn(
    accountId: string,
    pagination: PaginationModel,
    dataRange?: DataRangeModel,
  ): TransferEntity[] {
    const arrayTransfer = this.transferRepository.findByIncomeId(accountId);
    const arrayTransferReturn: TransferEntity[] = [];
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
   * Obtener historial de transacciones de una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  getHistory(
    accountId: string,
    pagination: PaginationModel,
    dataRange?: DataRangeModel,
  ): TransferEntity[] {
    const arrayTransfer = this.transferRepository.findByDateRange(
      accountId,
      0,
      Date.now(),
    );
    const arrayTransferReturn: TransferEntity[] = [];
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
   * Borrar una transacción
   *
   * @param {string} transferId
   * @memberof TransferService
   */
  deleteTransfer(transferId: string): void {
    const transfer = this.transferRepository.findOneById(transferId);
    if (transfer.deletedAt === undefined) {
      this.transferRepository.delete(transferId, true);
    } else {
      this.transferRepository.delete(transferId, false);
    }
  }
  findAll(): TransferEntity[] {
    return this.transferRepository.findAll();
  }
  findOneById(id: string): TransferEntity {
    const findTransfer = this.transferRepository.findOneById(id);
    if (findTransfer) {
      return findTransfer;
    } else {
      throw new NotFoundException('No se encontro la Transferencia con ese ID');
    }
  }
  getHistoryOutcomeCustomerId(customerId: string): TransferEntity[] {
    return this.transferRepository.findByOutcomeCustomerId(customerId)
  }
}

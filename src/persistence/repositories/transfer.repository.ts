import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { TransferEntity } from '../entities';
import { BodyRepositoryAbstract } from './base/base.repository';
import { TransferRepositoryInterface } from './interface/transfer/transfer-repository.interface';

@Injectable()
export class TransferRespository
  extends BodyRepositoryAbstract<TransferEntity>
  implements TransferRepositoryInterface {
  register(entity: TransferEntity): TransferEntity {
    this.database.push(entity);
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.id === entity.id,
    );
    return this.database[transferIndex];
  }
  update(id: string, entity: TransferEntity): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.id === id,
    );
    const data = this.database[transferIndex];
    this.database[transferIndex] = {
      ...data,
      ...entity,
      id: id,
    };
    return this.database[transferIndex];
  }
  delete(id: string, soft?: boolean | undefined): void {
    const transfer = this.findOneById(id)
    if (soft || soft === undefined) {
      transfer.deletedAt = Date.now()
      this.update(id, transfer)
    }
    else {
      const transferIndex = this.database.findIndex(
        (account) => account.id === id
      );
      this.database.splice(transferIndex, 1);
    }
  }
  findAll(): TransferEntity[] {
    return this.database.filter(transfer => transfer.deletedAt === undefined);
  }
  findOneById(id: string): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.id === id,
    );
    if (transferIndex >= 0) {
      return this.database[transferIndex];
    }
    else {
      throw new NotFoundException("No se encontro transferencia")
    }

  }
  findByIncomeCustomerId(id: string): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.income.customerId.id === id,
    );
    if (transferIndex >= 0) {
      return this.database[transferIndex];
    }
    else {
      throw new NotFoundException("No se encontro transferencia")
    }

  }
  findByIncomeId(id: string): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.income.id === id,
    );
    if (transferIndex >= 0) {
      return this.database[transferIndex];
    }
    else {
      throw new NotFoundException("No se encontro transferencia")
    }
  }
  findByOutcomeId(id: string): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.outcome.id === id,
    );
    if (transferIndex >= 0) {
      return this.database[transferIndex];
    }
    else {
      throw new NotFoundException("No se encontro transferencia")
    }
  }
  findByOutcomeCustomerId(id: string): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.outcome.customerId.id === id,
    );
    if (transferIndex >= 0) {
      return this.database[transferIndex];
    }
    else {
      throw new NotFoundException("No se encontro transferencia")
    }
  }
  findByAmountGreaterThan(amount: number): TransferEntity[] {
    let arrayAmount: TransferEntity[] = [];
    this.database.map((transfer) => {
      if (transfer.amount > amount) {
        arrayAmount.push(transfer);
      }
    });
    if (arrayAmount.length > 0) {
      return arrayAmount;
    }
    else {
      throw new NotFoundException("No se encontro ningun elemento")
    }

  }
  findByAmountLessThan(amount: number): TransferEntity[] {
    let arrayAmount: TransferEntity[] = [];
    this.database.map((transfer) => {
      if (transfer.amount < amount) {
        arrayAmount.push(transfer);
      }
    });
    if (arrayAmount.length > 0) {
      return arrayAmount;
    }
    else {
      throw new NotFoundException("No se encontro ningun elemento")
    }
  }
  hardDelete(id: string): void {
    const transferIndex = this.database.findIndex(
      (account) => account.id === id
    );
    if (transferIndex >= 0) {
      this.database.splice(transferIndex, 1);
    }
    else {
      throw new NotFoundException("No se encontro ningun elemento")
    }
  }
  softDelete(id: string): void {
    const transfer = this.findOneById(id)
    transfer.deletedAt = Date.now()
    this.update(id, transfer)
  }
  sortByDate(date: number | Date): TransferEntity[] {
    let arrayDate: TransferEntity[] = []
    arrayDate = this.database.sort()
    return arrayDate
  }
}

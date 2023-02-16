import { Injectable, NotFoundException } from '@nestjs/common';
import { TransferEntity } from '../entities';
import { BodyRepositoryAbstract } from './base/base.repository';
import { TransferRepositoryInterface } from './interface/transfer/transfer-repository.interface';

@Injectable()
export class TransferRespository
  extends BodyRepositoryAbstract<TransferEntity>
  implements TransferRepositoryInterface
{
  register(entity: TransferEntity): TransferEntity {
    this.database.push(entity);
    return this.database.at(-1) ?? entity;
  }
  update(id: string, entity: TransferEntity): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.id === id,
    );
    if (transferIndex >= 0) {
      const data = this.database[transferIndex];
      this.database[transferIndex] = {
        ...data,
        ...entity,
        id: id,
      };
      return this.database[transferIndex];
    } else {
      throw new NotFoundException('No se encontro transferencia');
    }
  }
  delete(id: string, soft?: boolean | undefined): void {
    const transfer = this.findOneById(id);
    if (soft || soft === undefined) {
      this.softDelete(id);
    } else {
      this.hardDelete(id);
    }
  }
  findAll(): TransferEntity[] {
    return this.database.filter((transfer) => transfer.deletedAt === undefined);
  }
  findOneById(id: string): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.id === id,
    );
    return this.database[transferIndex];
  }
  findByIncomeCustomerId(id: string): TransferEntity {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.income.customer.id === id,
    );
    if (transferIndex >= 0) {
      return this.database[transferIndex];
    } else {
      throw new NotFoundException('No se encontro transferencia');
    }
  }
  findByIncomeId(id: string): TransferEntity[] {
    const transferArray = this.database.filter(
      (transfer) => transfer.income.id === id,
    );
    if (transferArray.length > 0) {
      return transferArray;
    } else {
      throw new NotFoundException('No se encontro transferencia');
    }
  }
  findByOutcomeId(id: string): TransferEntity[] {
    const transferArray = this.database.filter(
      (transfer) => transfer.outcome.id === id,
    );
    if (transferArray.length > 0) {
      return transferArray;
    } else {
      throw new NotFoundException('No se encontro transferencia');
    }
  }
  findByOutcomeCustomerId(id: string): TransferEntity[] {
    return this.database.filter((transfer) => transfer.outcome.customer.id === id);
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
    } else {
      throw new NotFoundException('No se encontro ningun elemento');
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
    } else {
      throw new NotFoundException('No se encontro ningun elemento');
    }
  }
  private hardDelete(id: string): void {
    const transferIndex = this.database.findIndex(
      (transfer) => transfer.id === id,
    );
    if (transferIndex >= 0) {
      this.database.splice(transferIndex, 1);
    } else {
      throw new NotFoundException('No se encontro ningun elemento');
    }
  }
  private softDelete(id: string): void {
    const transfer = this.findOneById(id);
    transfer.deletedAt = Date.now();
    this.update(id, transfer);
  }
  sortByDate(date: number | Date): TransferEntity[] {
    let arrayDate: TransferEntity[] = [];
    arrayDate = this.database.sort();
    return arrayDate;
  }
  findByDateRange(
    id: string,
    DateMin: number | Date,
    DateMax: Number | Date,
  ): TransferEntity[] {
    const arrayTransfers = this.findAll();
    return arrayTransfers.filter(
      (transfer) =>
        transfer.id === id &&
        transfer.dateTime >= DateMin &&
        transfer.dateTime <= DateMax,
    );
  }
}

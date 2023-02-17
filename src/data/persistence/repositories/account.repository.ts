import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountEntity } from '../entities';
import { BodyRepositoryAbstract } from './base/base.repository';
import { AccountRepositoryInterface } from './interface/account/account-repository.interface';

@Injectable()
export class AccountRepository
  extends BodyRepositoryAbstract<AccountEntity>
  implements AccountRepositoryInterface
{
  register(entity: AccountEntity): AccountEntity {
    this.database.push(entity);
    return this.database.at(-1) ?? entity;
  }
  update(id: string, entity: AccountEntity): AccountEntity {
    const accountIndex = this.database.findIndex(
      (account) => account.id === id,
    );
    if (accountIndex >= 0) {
      const data = this.database[accountIndex];
      this.database[accountIndex] = {
        ...data,
        ...entity,
        id: id,
      };
      return this.database[accountIndex];
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  delete(id: string, soft?: boolean | undefined): void {
    const account = this.findOneById(id);
    if (soft || soft === undefined) {
      this.softDelete(id);
    } else {
      this.hardDelete(id);
    }
  }
  findAll(): AccountEntity[] {
    const allAccounts = this.database.filter(
      (account) => account.deletedAt === undefined,
    );
    return allAccounts;
  }
  findOneById(id: string): AccountEntity {
    const accountIndex = this.database.findIndex(
      (account) => account.id === id,
    );
    return this.database[accountIndex];
  }
  findByState(state: boolean): AccountEntity[] {
    let arrayState: AccountEntity[] = [];
    this.database.map((documentType) => {
      if (documentType.state === state) {
        arrayState.push(documentType);
      }
    });
    if (arrayState.length > 0) {
      return arrayState;
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  findBalanceGreaterThan(balance: number): AccountEntity[] {
    let arrayBalanceGreater: AccountEntity[] = [];
    this.database.map((documentType) => {
      if (documentType.balance > balance) {
        arrayBalanceGreater.push(documentType);
      }
    });
    if (arrayBalanceGreater.length > 0) {
      return arrayBalanceGreater;
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  findBalanceLessThan(balance: number): AccountEntity[] {
    let arrayBalanceLess: AccountEntity[] = [];
    this.database.map((documentType) => {
      if (documentType.balance < balance) {
        arrayBalanceLess.push(documentType);
      }
    });
    if (arrayBalanceLess.length > 0) {
      return arrayBalanceLess;
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  findByCustomerId(id: string): AccountEntity {
    const accountIndex = this.database.findIndex(
      (account) => account.customer.id === id,
    );
    return this.database[accountIndex];
  }
  findByAccountTypeId(id: string): AccountEntity {
    const accountIndex = this.database.findIndex(
      (account) => account.accountType.id === id,
    );
    return this.database[accountIndex];
  }
  findByDocumentTypeId(id: string): AccountEntity {
    const accountIndex = this.database.findIndex(
      (account) => account.customer.documentType.id === id,
    );
    if (accountIndex >= 0) {
      return this.database[accountIndex];
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  private hardDelete(id: string): void {
    const accountIndex = this.database.findIndex(
      (account) => account.id === id,
    );
    if (accountIndex >= 0) {
      this.database.splice(accountIndex, 1);
    } else {
      throw new NotFoundException('No se encontro ningun elemento');
    }
  }
  private softDelete(id: string): void {
    const account = this.findOneById(id);
    account.deletedAt = Date.now();
    this.update(id, account);
  }
  findByStateId(id: string): boolean {
    const accountIndex = this.database.findIndex(
      (account) => account.id === id,
    );
    if (accountIndex >= 0) return this.database[accountIndex].state;
    else throw new NotFoundException('No se encontro la cuenta');
  }
  changeStateId(id: string, state: boolean): void {
    const accountIndex = this.database.findIndex(
      (account) => account.id === id,
    );
    if (accountIndex >= 0) {
      const account = this.database[accountIndex];
      account.state = state;
      this.update(id, account);
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  getAllAccounts(customerId: string): AccountEntity[] {
    return this.findAll().filter(
      (account) => account.customer.id === customerId,
    );
  }

  deleteAllAccounts(customerId: string): void {
    this.findAll().filter((account) => {
      if (account.customer.id === customerId) {
        this.delete(account.id);
      }
    });
  }
}

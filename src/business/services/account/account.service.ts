import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountEntity, AccountRepository, AccountTypeEntity, AccountTypeRepository, CustomerEntity, CustomerRepository } from 'src/data/persistence';
import { NewAccountDTO } from 'src/business/dtos';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountTypeRepository: AccountTypeRepository,
    private readonly customerRepository: CustomerRepository
  ) { }

  findAll(): AccountEntity[] {
    return this.accountRepository.findAll()
  }

  /**
   * Crear una cuenta
   *
   * @param {AccountModel} account
   * @return {*}  {AccountEntity}
   * @memberof AccountService
   */
  createAccount(account: NewAccountDTO): AccountEntity {
    const newAccount = new AccountEntity();
    let newCustomer = new CustomerEntity()
    newCustomer = this.customerRepository.findOneById(account.customer)
    const newAccountType = new AccountTypeEntity()
    newAccountType.id = account.accountType
    const findAccount = this.accountRepository.findByCustomerId(
      account.customer
    );
    if (findAccount) {
      throw new BadRequestException();
    } else {
      newAccount.customer = newCustomer;
      newAccount.accountType = newAccountType;
      this.accountTypeRepository.register(newAccountType)
      return this.accountRepository.register(newAccount);
    }
  }

  /**
   * Obtener el balance de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {number}
   * @memberof AccountService
   */
  getBalance(accountId: string): number {
    const account = this.accountRepository.findOneById(accountId);
    if (account) {
      if (account.state) {
        return account.balance;
      } else {
        throw new NotFoundException('La cuenta no se encuentra activa');
      }
    } else {
      throw new NotFoundException('No se encontro ninguna cuenta con ese ID');
    }
  }

  /**
   * Agregar balance a una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  addBalance(accountId: string, amount: number): AccountEntity {
    const balance = this.getBalance(accountId);
    if (balance != undefined) {
      const account = this.accountRepository.findOneById(accountId);
      account.balance = account.balance + amount;
      return this.accountRepository.update(accountId, account);
    }
    else {
      throw new NotFoundException("No existe una cuenta con ese ID")
    }
  }
  /**
   * Remover balance de una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  removeBalance(accountId: string, amount: number): AccountEntity {
    const balance = this.getBalance(accountId);
    if (balance != undefined) {
      const account = this.accountRepository.findOneById(accountId);
      if (account.balance >= amount) {
        account.balance = account.balance - amount;
        return this.accountRepository.update(accountId, account);
      } else {
        throw new NotFoundException('No se puede realizar esta operacion');
      }
    }
    else {
      throw new NotFoundException("No existe cuenta con este ID");
    }
  }

  /**
   * Verificar la disponibilidad de un monto a retirar en una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  verifyAmountIntoBalance(accountId: string, amount: number): boolean {
    const balance = this.getBalance(accountId);
    if (balance && balance >= amount) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Obtener el estado de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  getState(accountId: string): boolean {
    const accountState = this.accountRepository.findByStateId(accountId);
    if (accountState != undefined) {
      return accountState;
    } else {
      throw new NotFoundException('No se encontro cuenta con ese ID');
    }
  }

  /**
   * Cambiar el estado de una cuenta
   *
   * @param {string} accountId
   * @param {boolean} state
   * @memberof AccountService
   */
  changeState(accountId: string, state: boolean): AccountEntity {
    const account = this.accountRepository.findOneById(accountId);
    if (account) {
      const accountTypeState = this.accountTypeRepository.findByStateId(
        account.accountType.id,
      );
      if (accountTypeState) {
        account.state = state;
        return this.accountRepository.update(accountId, account);
      } else {
        throw new NotFoundException(
          'No se puede cambiar de estado, ya que el tipo de cuenta esta en ' +
          accountTypeState,
        );
      }
    }
    else {
      throw new NotFoundException("No se encontro cuenta con ese ID ")
    }
  }

  /**
   * Obtener el tipo de cuenta de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  getAccountType(accountId: string): AccountTypeEntity {
    const account = this.accountRepository.findOneById(accountId);
    return account.accountType;
  }

  /**
   * Cambiar el tipo de cuenta a una cuenta
   *
   * @param {string} accountId
   * @param {string} accountTypeId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  changeAccountType(
    accountId: string,
    accountTypeId: string,
  ): AccountTypeEntity {
    const account = this.accountRepository.findOneById(accountId);
    const accountType =
      this.accountRepository.findByAccountTypeId(accountTypeId);
    if (accountType) {
      throw new BadRequestException(
        'El ID del tipo de cuenta ya tiene una cuenta asociada.',
      );
    } else {
      account.accountType.id = accountTypeId;
      const accountTypeDataBase = this.accountTypeRepository.findOneById(accountTypeId)
      this.accountRepository.update(accountId, account);
      return this.accountTypeRepository.update(accountTypeId, accountTypeDataBase);
    }
  }

  /**
   * Borrar una cuenta
   *
   * @param {string} accountId
   * @memberof AccountService
   */
  deleteAccount(accountId: string): void {
    const balance = this.getBalance(accountId);
    if (balance > 0) {
      throw new BadRequestException('No se puede eliminar, la cuenta tiene saldo');
    } else {
      const state = this.getState(accountId);
      if (state) {
        throw new BadRequestException('No se puede eliminar, la cuenta se encuentra activa');
      } else {
        this.accountRepository.delete(accountId);
      }
    }
  }
  findOneById(id: string): AccountEntity {
    return this.accountRepository.findOneById(id)
  }
  updateAccount(id: string, account: NewAccountDTO): AccountEntity {
    const findAccount = this.accountRepository.findOneById(id)
    const newAccount = new AccountEntity()
    const newCustomer = new CustomerEntity()
    newCustomer.id = account.customer
    const newAccounType = new AccountTypeEntity()
    newAccounType.id = account.accountType
    if (findAccount) {
      newAccount.balance = account.balance
      newAccount.accountType = newAccounType
      newAccount.customer = newCustomer
      return this.accountRepository.update(id, newAccount)
    }
    else {
      throw new NotFoundException("No se encontro la cuenta")
    }
  }

  createTypeAccount(name: string): AccountTypeEntity {
    const newAccountType = new AccountTypeEntity()
    newAccountType.name = name
    return this.accountTypeRepository.register(newAccountType)
  }
}

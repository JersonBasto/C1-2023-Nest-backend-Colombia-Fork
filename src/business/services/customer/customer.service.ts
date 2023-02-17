import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  AccountEntity,
  AccountRepository,
  CustomerEntity,
  CustomerRepository,
  DocumentTypeEntity,
} from 'src/data/persistence';
import { newCustomerDTO } from 'src/business/dtos';
import { v4 as uuid } from 'uuid';
import { UserGoogle } from 'src/business/dtos/security/new-user.google.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  findAllUsers(): CustomerEntity[] {
    return this.customerRepository.findAll();
  }

  /**
   * Se crea usuario
   *
   * @param customer
   * @returns
   */
  createCustomer(customer: newCustomerDTO): CustomerEntity {
    const newCustomer = new CustomerEntity();
    const newDocumentType = new DocumentTypeEntity();
    newDocumentType.id = customer.documentType;
    const findCustomer = this.customerRepository.findByEmail(customer.email);
    if (findCustomer) {
      throw new BadRequestException();
    } else {
      newCustomer.document = customer.document;
      newCustomer.documentType = newDocumentType;
      newCustomer.email = customer.email;
      newCustomer.fullName = customer.fullName;
      newCustomer.phone = customer.phone;
      newCustomer.password = customer.password;
      return this.customerRepository.register(newCustomer);
    }
  }
  /**
   * Obtener información de un cliente
   *
   * @param {string} customerId
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
  getCustomerInfo(customerId: string): CustomerEntity {
    return this.customerRepository.findOneById(customerId);
  }

  /**
   * Actualizar información de un cliente
   *
   * @param {string} id
   * @param {CustomerModel} customer
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
  updatedCustomer(id: string, customer: newCustomerDTO): CustomerEntity {
    const findCustomer = this.customerRepository.findOneById(id);
    const findByEmail = this.customerRepository.findByEmail(customer.email);
    if (findByEmail) {
      if (findCustomer.id === findByEmail.id) {
        findCustomer.document = customer.document;
        findCustomer.email = customer.email;
        findCustomer.fullName = customer.fullName;
        findCustomer.phone = customer.phone;
        return this.customerRepository.update(id, findCustomer);
      } else {
        throw new BadRequestException();
      }
    } else {
      findCustomer.document = customer.document;
      findCustomer.email = customer.email;
      findCustomer.fullName = customer.fullName;
      findCustomer.phone = customer.phone;
      return this.customerRepository.update(id, findCustomer);
    }
  }
  updatedCustomerGoogle(id: string, customer: UserGoogle): CustomerEntity {
    const findCustomer = this.customerRepository.findOneById(id);
    const findByEmail = this.customerRepository.findByEmail(customer.email);
    if (findByEmail) {
      if (findCustomer.id === findByEmail.id) {
        findCustomer.document = customer.document ?? "";
        findCustomer.documentType.name = customer.documentType ?? "";
        findCustomer.email = customer.email;
        findCustomer.fullName = customer.fullName;
        findCustomer.phone = customer.phone ?? "";
        return this.customerRepository.update(id, findCustomer);
      } else {
        throw new BadRequestException();
      }
    } else {
      findCustomer.document = customer.document ?? "";
      findCustomer.documentType.name = customer.documentType ?? "";
      findCustomer.email = customer.email;
      findCustomer.fullName = customer.fullName;
      findCustomer.phone = customer.phone ?? "";
      return this.customerRepository.update(id, findCustomer);
    }
  }

  /**
   * Dar de baja a un cliente en el sistema
   *
   * @param {string} id
   * @return {*}  {boolean}
   * @memberof CustomerService
   */
  unsubscribe(id: string): boolean {
    const account = this.getAllAccounts(id);
    const customer = this.customerRepository.findOneById(id);
    const accounts = account.filter((account) => account.balance > 0);
    if (accounts.length > 0) {
      throw new BadRequestException(
        'No se puede realizar esta operacion el usuario tiene cuenta con saldo mayor a cero',
      );
    } else {
      if (customer.deletedAt === undefined) {
        this.accountRepository.deleteAllAccounts(customer.id);
        this.customerRepository.delete(id, true);
        return false;
      } else {
        this.customerRepository.delete(id, false);
        return true;
      }
    }
  }
  deleteCustomer(id: string, soft?: boolean): void {
    const customer = this.getCustomerInfo(id);
    if (customer) {
      this.customerRepository.delete(id, soft);
    } else {
      throw new BadRequestException();
    }
  }
  getAllAccounts(id: string): AccountEntity[] {
    return this.accountRepository.getAllAccounts(id);
  }

  findByFullName(name: string): CustomerEntity[] {
    return this.customerRepository.findByFullName(name);
  }
}

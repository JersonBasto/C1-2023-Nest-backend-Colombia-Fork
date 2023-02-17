import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity, AccountEntity } from '../entities';
import { BodyRepositoryAbstract } from './base/base.repository';
import { CustomerRepositoryInterface } from './interface/customer/customer-repository.interface';

@Injectable()
export class CustomerRepository
  extends BodyRepositoryAbstract<CustomerEntity>
  implements CustomerRepositoryInterface
{
  register(entity: CustomerEntity): CustomerEntity {
    this.database.push(entity);
    const customerIndex = this.database.findIndex(
      (customer) => customer.id === entity.id,
    );
    return this.database[customerIndex] ?? entity;
  }
  update(id: string, entity: CustomerEntity): CustomerEntity {
    const customerIndex = this.database.findIndex(
      (customer) => customer.id === id && customer.deletedAt === undefined,
    );
    if (customerIndex >= 0) {
      const data = this.database[customerIndex];
      this.database[customerIndex] = {
        ...data,
        ...entity,
        id: id,
      };
      return this.database[customerIndex];
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  delete(id: string, soft?: boolean | undefined): void {
    if (soft || soft === undefined) {
      this.softDelete(id);
    } else {
      this.hardDelete(id);
    }
  }
  findAll(): CustomerEntity[] {
    const allUsers = this.database.filter(
      (customer) => customer.deletedAt === undefined,
    );
    return allUsers;
  }
  findOneById(id: string): CustomerEntity {
    const customerIndex = this.database.findIndex(
      (customer) => customer.id === id && customer.deletedAt === undefined,
    );
    if (customerIndex >= 0) {
      return this.database[customerIndex];
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  findByDocumentTypeId(documentTypeId: string): CustomerEntity {
    const customerIndex = this.database.findIndex(
      (customer) => customer.documentType.id === documentTypeId,
    );
    if (customerIndex >= 0) {
      return this.database[customerIndex];
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  findByEmail(email: string): CustomerEntity {
    const customerIndex = this.database.findIndex(
      (customer) => customer.email === email,
    );
    return this.database[customerIndex];
  }
  findByState(state: boolean): CustomerEntity[] {
    let arrayState: CustomerEntity[] = [];
    this.database.map((customer) => {
      if (customer.state === state) {
        arrayState.push(customer);
      }
    });
    if (arrayState.length > 0) {
      return arrayState;
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  findEmailAndPassword(email: string, password: string): boolean {
    const customer = this.database.filter(
      (customer) =>
        customer.email === email &&
        customer.password === password &&
        customer.deletedAt === undefined,
    );
    if (customer && customer.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  findByFullName(name: string): CustomerEntity[] {
    let arrayName: CustomerEntity[] = [];
    this.database.map((customer) => {
      if (customer.fullName.toLowerCase().includes(name.toLowerCase())) {
        arrayName.push(customer);
      }
    });
    if (arrayName.length > 0) {
      return arrayName;
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  private hardDelete(id: string): void {
    const customerIndex = this.database.findIndex(
      (account) => account.id === id,
    );
    if (customerIndex >= 0) {
      this.database.splice(customerIndex, 1);
    } else {
      throw new NotFoundException('No se encontro ningun elemento');
    }
  }
  private softDelete(id: string): void {
    let newCustomer = new CustomerEntity();
    const customer = this.findOneById(id);
    newCustomer = {
      ...newCustomer,
      ...customer,
      id: id,
    };
    newCustomer.deletedAt = Date.now();
    this.update(id, newCustomer);
  }
  findByPhone(phone: string): CustomerEntity[] {
    let arrayPhone: CustomerEntity[] = [];
    this.database.map((customer) => {
      if (customer.phone.includes(phone)) {
        arrayPhone.push(customer);
      }
    });
    if (arrayPhone.length > 0) {
      return arrayPhone;
    } else {
      throw new NotFoundException('No se encontro la informacion');
    }
  }
  findByIdFireBase(idFirebase: string): CustomerEntity {
    const customerIndex = this.database.findIndex(
      (customer) =>
        customer.idFireBase === idFirebase && customer.deletedAt === undefined,
    );
    return this.database[customerIndex];
  }
}

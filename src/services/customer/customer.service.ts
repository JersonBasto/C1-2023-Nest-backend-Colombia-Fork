import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomerModel } from "src/models";
import { CustomerEntity } from "src/persistence/entities";
import { CustomerRepository } from "src/persistence/repositories/customer.repository";

@Injectable()
export class CustomerService {

    constructor(private readonly customerRepository: CustomerRepository) { }

    /**
   * Obtener información de un cliente
   *
   * @param {string} customerId
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
    getCustomerInfo(customerId: string): CustomerEntity {
        return this.customerRepository.findOneById(customerId)
    }

    /**
     * Actualizar información de un cliente
     *
     * @param {string} id
     * @param {CustomerModel} customer
     * @return {*}  {CustomerEntity}
     * @memberof CustomerService
     */
    updatedCustomer(id: string, customer: CustomerModel): CustomerEntity {
        return this.updatedCustomer(id, customer);
    }

    /**
     * Dar de baja a un cliente en el sistema
     *
     * @param {string} id
     * @return {*}  {boolean}
     * @memberof CustomerService
     */
    unsubscribe(id: string): boolean {
        throw new Error('Method not implemented.');
    }
}
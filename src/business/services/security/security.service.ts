import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  AccountTypeEntity,
  CustomerEntity,
  CustomerRepository,
  DocumentTypeEntity,
  DocumentTypeRepository,
} from 'src/data/persistence';
import {
  NewAccountDTO,
  newCustomerDTO,
  NewSecurityDTO,
} from 'src/business/dtos';
import { AccountService } from '../account';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/configs/constants.config';
import { UserGoogle } from 'src/business/dtos/security/new-user.google.dto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  /**
   * Identificarse en el sistema
   *
   * @param {CustomerModel} user
   * @return {*}  {string}
   * @memberof SecurityService
   */
  signIn(user: NewSecurityDTO): {} {
    const answer = this.customerRepository.findEmailAndPassword(
      user.email,
      user.password,
    );
    if (answer) {
      const customer = this.customerRepository.findByEmail(user.email);
      return {
        access_token: this.jwtService.sign({ id: customer.id }),
        id: customer.id,
      };
    } else throw new UnauthorizedException('Datos de identificación inválidos');
  }
  /**
   * Crear usuario en el sistema
   *
   * @param {CustomerModel} user
   * @return {*}  {string}
   * @memberof SecurityService
   */
  signUp(user: newCustomerDTO): {} {
    const newCustomer = new CustomerEntity();
    const newDocumentType = new DocumentTypeEntity();
    newDocumentType.id = uuid();
    newDocumentType.name = user.documentType;
    this.documentTypeRepository.register(newDocumentType);
    const findCustomer = this.customerRepository.findByEmail(user.email);
    if (findCustomer) {
      throw new BadRequestException();
    } else {
      newCustomer.documentType = newDocumentType;
      newCustomer.document = user.document;
      newCustomer.fullName = user.fullName;
      newCustomer.email = user.email;
      newCustomer.phone = user.phone;
      newCustomer.password = user.password;

      const customer = this.customerRepository.register(newCustomer);

      if (customer) {
        const accountType = new AccountTypeEntity();
        accountType.id = uuid();
        accountType.name = 'CA';
        const newAccount = new NewAccountDTO();
        newAccount.customer = customer.id;
        newAccount.accountType = accountType.id;

        const account = this.accountService.createAccount(newAccount);

        if (account)
          return {
            access_token: this.jwtService.sign({ id: customer.id }),
            id: customer.id,
          };
        else throw new InternalServerErrorException();
      } else throw new InternalServerErrorException();
    }
  }

  /**
   * Salir del sistema
   *
   * @param {string} JWToken
   * @memberof SecurityService;
   */
  signOut(JWToken: string): void {
    this.jwtService.verify(JWToken, {
      secret: jwtConstants.secret,
      maxAge: '2s',
    });
  }
  signByGoogle(user: UserGoogle) {
    const newCustomer = new CustomerEntity();
    const newDocumentType = new DocumentTypeEntity();
    newDocumentType.id = uuid();
    newDocumentType.name = '';
    this.documentTypeRepository.register(newDocumentType);
    const findCustomer = this.customerRepository.findByEmail(user.email);
    if (findCustomer) {
      throw new BadRequestException();
    } else {
      newCustomer.documentType = newDocumentType;
      newCustomer.document = '';
      newCustomer.idFireBase = user.idFirebase;
      newCustomer.fullName = user.fullName;
      newCustomer.email = user.email;
      newCustomer.phone = user.phone ?? '';

      const customer = this.customerRepository.register(newCustomer);

      if (customer) {
        const accountType = new AccountTypeEntity();
        accountType.id = uuid();
        accountType.name = 'CA';
        const newAccount = new NewAccountDTO();
        newAccount.customer = customer.id;
        newAccount.accountType = accountType.id;

        const account = this.accountService.createAccount(newAccount);

        if (account)
          return {
            access_token: this.jwtService.sign({ id: customer.id }),
            id: customer.id,
          };
        else throw new InternalServerErrorException();
      } else throw new InternalServerErrorException();
    }
  }
}

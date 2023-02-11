import { Module } from '@nestjs/common';
import { AccountRepository, AccountTypeRepository, CustomerRepository, DepositRepository, DocumentTypeRepository, TransferRespository } from './data/persistence';
import { AccountService, CustomerService, DepositService, SecurityService, TransferService } from './business/services';
import { AccountModule, CustomerModule, DepositModule, SecurityModule, TransferModule } from './data/modules';
import { AccountController, CustomerController, DepositController, SecurityController, TransferController } from './presentation/controllers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './configs/constants.config';


@Module({
  imports: [JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '24h' },
  })],
  controllers: [
    AccountController, 
    CustomerController, 
    DepositController, 
    SecurityController, 
    TransferController],
  providers: [
    AccountService, 
    DepositService, 
    TransferService, 
    CustomerService, 
    SecurityService, 
    DepositRepository, 
    CustomerRepository, 
    TransferRespository, 
    DocumentTypeRepository, 
    AccountTypeRepository, 
    AccountRepository]
})
export class AppModule { }

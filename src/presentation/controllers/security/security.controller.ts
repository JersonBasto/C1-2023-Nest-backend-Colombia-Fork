// Libraries
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { newCustomerDTO, NewSecurityDTO } from 'src/business/dtos';
import { UserGoogle } from 'src/business/dtos/security/new-user.google.dto';
import { SecurityService } from 'src/business/services';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('/login')
  login(@Body() security: NewSecurityDTO) {
    return this.securityService.signIn(security);
  }

  @Post('/login/google')
  loginGoogle(@Body() idFirebase: { id: string }) {
    return this.securityService.loginByGoogle(idFirebase.id);
  }

  @Post('/register')
  createCustomer(@Body() customer: newCustomerDTO) {
    return this.securityService.signUp(customer);
  }

  @Post('/logout')
  logout(@Body() token: { token: string }) {
    return this.securityService.signOut(token.token);
  }

  @Post('/user-google')
  newUserGoogle(@Body() user: UserGoogle) {
    return this.securityService.signByGoogle(user);
  }
}

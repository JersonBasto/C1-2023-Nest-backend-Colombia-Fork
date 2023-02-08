// Libraries
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { newCustomerDTO, NewSecurityDTO } from 'src/business/dtos';
import { SecurityService } from 'src/business/services';
import { JwtGuard } from 'src/presentation/guards/guard-jwt';

@Controller('security')
export class SecurityController {
    constructor(private readonly securityService: SecurityService) { }

    @Post("/login")
    login(@Body() security: NewSecurityDTO) {
        return this.securityService.signIn(security)
    }

    @Post("/register")
    createCustomer(@Body() customer: newCustomerDTO) {
        return this.securityService.signUp(customer)
    }

    @Post("/logout")
    logout(@Body() token: { token: string }) {
        return this.securityService.signOut(token.token)
    }
}

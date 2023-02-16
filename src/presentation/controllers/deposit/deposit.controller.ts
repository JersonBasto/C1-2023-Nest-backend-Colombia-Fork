import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { DepositEntity } from "src/data/persistence";
import { DataRangeEntity } from "src/data/persistence/entities/data-range.entity";
import { PaginationEntity } from "src/data/persistence/entities/pagination.entity";
import { DepositService } from "src/business/services";
import { NewDepositDTO } from "src/business/dtos/deposit";
import { JwtGuard } from "src/presentation/guards/guard-jwt";

@Controller("deposit")
export class DepositController {
    constructor(private readonly depositService: DepositService) {
    }

    @Get()
    findAll() {
        return this.depositService.findAll()
    }

    @Get(":id")
    //@UseGuards(JwtGuard)
    getDeposit(@Param("id", new ParseUUIDPipe()) id: string): DepositEntity {
        return this.depositService.findOneById(id)
    }

    @Post()
    //@UseGuards(JwtGuard)
    createDeposit(@Body() deposit: NewDepositDTO): DepositEntity {
        return this.depositService.createDeposit(deposit)
    }

    @Post("/getHistory/:id")
    //@UseGuards(JwtGuard)
    getHistory(@Param("id", new ParseUUIDPipe()) id: string, @Body() data: { actualPage: number, range: number }): DepositEntity[] {
        const newPagination = new PaginationEntity()
        newPagination.actualPage = data.actualPage;
        const newDataRange = new DataRangeEntity()
        newDataRange.range = data.range;
        return this.depositService.getHistory(id, newPagination, newDataRange)
    }

    @Put(":id")
    //@UseGuards(JwtGuard)
    updateDeposit(@Param("id", new ParseUUIDPipe()) id: string, @Body() deposit: NewDepositDTO): DepositEntity {
        return this.depositService.updateDeposit(id, deposit)
    }

    @Delete(":id")
    //@UseGuards(JwtGuard)
    deleteDeposit(@Param("id", new ParseUUIDPipe()) id: string): void {
        return this.depositService.deleteDeposit(id)
    }
}
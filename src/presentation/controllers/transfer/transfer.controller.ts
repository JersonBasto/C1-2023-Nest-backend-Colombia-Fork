import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  DataRangeEntity,
  PaginationEntity,
  TransferEntity,
} from 'src/data/persistence';
import { NewTransferDTO } from 'src/business/dtos';
import { TransferService } from 'src/business/services';
import { JwtGuard } from 'src/presentation/guards/guard-jwt';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Get()
  findAll() {
    return this.transferService.findAll();
  }

  @Get(':id')
  //@UseGuards(JwtGuard)
  findOneById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.transferService.findOneById(id);
  }

  @Post()
  //@UseGuards(JwtGuard)
  createTransfer(@Body() transfer: NewTransferDTO): TransferEntity {
    return this.transferService.createTransfer(transfer);
  }

  @Post('/historyOut/:id')
  //@UseGuards(JwtGuard)
  getHistoryOut(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: { actualPage: number; range: number },
  ) {
    const newPagination = new PaginationEntity();
    newPagination.actualPage = data.actualPage;
    const newDataRange = new DataRangeEntity();
    newDataRange.range = data.range;
    return this.transferService.getHistoryOut(id, newPagination, newDataRange);
  }

  @Post('/historyIncome/:id')
  //@UseGuards(JwtGuard)
  getHistoryIncome(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: { actualPage: number; range: number },
  ) {
    const newPagination = new PaginationEntity();
    newPagination.actualPage = data.actualPage;
    const newDataRange = new DataRangeEntity();
    newDataRange.range = data.range;
    return this.transferService.getHistoryIn(id, newPagination, newDataRange);
  }

  @Post('/history/:id')
  getHistory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: { actualPage: number; range: number },
  ) {
    const newPagination = new PaginationEntity();
    newPagination.actualPage = data.actualPage;
    const newDataRange = new DataRangeEntity();
    newDataRange.range = data.range;
    return this.transferService.getHistoryOutcomeCustomerId(id);
  }
}

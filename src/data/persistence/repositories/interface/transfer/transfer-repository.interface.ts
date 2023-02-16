import { TransferEntity } from 'src/data/persistence/entities';
import { BodyRepositoryInterface } from '../model-repository.interface';

export interface TransferRepositoryInterface
  extends BodyRepositoryInterface<TransferEntity> {
  findByIncomeId(id: string): TransferEntity[];
  findByOutcomeId(id: string): TransferEntity[];
  findByIncomeCustomerId(id: string): TransferEntity;
  findByOutcomeCustomerId(id: string): TransferEntity[];
  findByAmountGreaterThan(amount: number): TransferEntity[];
  findByAmountLessThan(amount: number): TransferEntity[];
  sortByDate(date: number | Date): TransferEntity[]
  findByDateRange(id: string, DateMin: Date | number, DateMax: Date | Number): TransferEntity[]
}

export class TransactionDto {
  id: number;
  participant: string;
  debit: number;
  credit: number;
  createdAt: Date;
}
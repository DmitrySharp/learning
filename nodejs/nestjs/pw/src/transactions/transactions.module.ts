import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { UsersModule } from '../users/users.module';
import { Transaction } from './transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), UsersModule],
  providers: [TransactionsService],
  exports: [TransactionsService, TypeOrmModule],
})
export class TransactionsModule {}

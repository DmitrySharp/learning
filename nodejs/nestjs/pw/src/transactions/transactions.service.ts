import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionDto } from './transaction.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private transactionsRepository: Repository<Transaction>,
        private usersService: UsersService,
    ) {}

    findAll(): Promise<Transaction[]> {
        return this.transactionsRepository.find();
    }

    findOne(id: number): Promise<Transaction> {
        return this.transactionsRepository.findOne(id);
    }

    findByUser(email: string): Promise<Transaction[] | undefined> {
        return this.transactionsRepository.find({ where: [{ sender: email }, { recepient: email }]});
    }

    async findByUserLimit(email: string, count: number | undefined, page: number | undefined): Promise<TransactionDto[] | undefined> {
        if(!count) count = 100;
        if(!page) page = 1;
        let transactions = await this.transactionsRepository.find({ 
                where: [{ sender: email }, { recepient: email }], 
                order: { createdAt: 'DESC' },
                take: count, 
                skip: count * (page - 1)
            });
        let result: TransactionDto[] = [];
        transactions.forEach((x) => {
            let dtoTransaction = new TransactionDto();
            dtoTransaction.createdAt = x.createdAt;
            dtoTransaction.id = x.id;
            if(x.sender == email) {
                dtoTransaction.debit =  x.amount;
                dtoTransaction.participant = x.recepient;
            }
            else {
                dtoTransaction.credit =  x.amount;
                dtoTransaction.participant = x.sender;
            }

            result.push(dtoTransaction);
        });
        return result;
    }

    async getBalance(email: string): Promise<number | undefined> {
        let debit = await this.transactionsRepository
                        .createQueryBuilder("transaction")
                        .select("SUM(transaction.amount)", "sum")
                        .where({ recepient: email })
                        .getRawOne();
        let credit = await this.transactionsRepository
                        .createQueryBuilder("transaction")
                        .select("SUM(transaction.amount)", "sum")
                        .where({ sender: email })
                        .getRawOne();

        return debit.sum - credit.sum;
    }

    async remove(id: string): Promise<void> {
        await this.transactionsRepository.delete(id);
    }

    async create(sender: string, recepient: string, amount: number): Promise<Transaction> {
        if(!(await this.usersService.findOneByEmail(sender)))
            throw new Error("Sender not found");
        if(!(await this.usersService.findOneByEmail(recepient)))
            throw new Error("Recepient not found");
        if(sender == recepient)
            throw new Error("Sender and Recepient must be different persons");
        if(amount <= 0)
            throw new Error("Amount must be grater than 0");
        if(await this.getBalance(sender) < amount)
            throw new Error("The balance for the sender less than provided amount");
        
        const transaction = new Transaction();
        transaction.sender = sender;
        transaction.recepient = recepient;
        transaction.amount = amount;
        transaction.createdAt = new Date(new Date().toUTCString());

        return await this.transactionsRepository.save(transaction);
    }
}

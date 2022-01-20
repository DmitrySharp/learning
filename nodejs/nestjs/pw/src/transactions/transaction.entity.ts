import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  recepient: string;

  @Column({type: "decimal", precision: 18, scale: 2})
  amount: number;

  @Column()
  createdAt: Date;
}
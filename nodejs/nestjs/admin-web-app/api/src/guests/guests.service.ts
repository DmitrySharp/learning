import { Injectable } from '@nestjs/common';
import { GuestEntity } from './guest.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class GuestsService extends TypeOrmCrudService<GuestEntity> {
  constructor(@InjectRepository(GuestEntity) repository) {
    super(repository);
  }
}
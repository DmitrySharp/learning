import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { GuestsService } from './guests.service';
import { GuestEntity } from './guest.entity';
@Crud(GuestEntity)
@Controller('guests')
export class GuestsController {
  constructor(public service: GuestsService) { }
}
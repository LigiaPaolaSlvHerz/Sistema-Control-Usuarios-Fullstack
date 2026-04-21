import { Controller, Get, Param } from '@nestjs/common';
import {SettlementService} from './settlement.service'
@Controller('settlements')
export class SettlementController {
    constructor(private readonly service: SettlementService) {}

  @Get('by-municipality/:id') // URL: GET http://localhost:3000/settlements/by-municipality/5
  getSettlements(@Param('id') id: number) {
    return this.service.findByMunicipality(id);
  }
}

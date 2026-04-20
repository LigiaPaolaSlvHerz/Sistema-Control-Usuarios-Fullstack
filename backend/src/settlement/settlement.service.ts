import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Settlement } from './settlement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettlementService {
    constructor(
    @InjectRepository(Settlement)
    private repo: Repository<Settlement>,
  ) {}

  // Para el segundo dropdown (filtrado por alcaldía)
  findByMunicipality(municipalityId: number) {
    return this.repo.find({ 
      where: { municipality_id: municipalityId, active: true } 
    });
  }
}

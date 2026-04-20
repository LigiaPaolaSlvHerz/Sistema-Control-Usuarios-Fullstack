import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Municipality } from './municipality.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MunicipalitiesService {
    constructor(
    @InjectRepository(Municipality)
    private repo: Repository<Municipality>,
  ) {}

  // Para el primer dropdown
  findAll() {
    return this.repo.find({ where: { active: true } });
  }
}

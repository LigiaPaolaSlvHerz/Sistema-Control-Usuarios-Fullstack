import { Module } from '@nestjs/common';
import { Settlement } from './settlement.entity'
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SettlementController],
  providers: [SettlementService],
  imports: [TypeOrmModule.forFeature([Settlement])],
})
export class SettlementModule {}


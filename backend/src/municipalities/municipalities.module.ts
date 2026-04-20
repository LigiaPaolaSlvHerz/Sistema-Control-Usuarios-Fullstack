import { Module } from '@nestjs/common';
import { Municipality } from './municipality.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipalitiesService } from './municipalities.service';
import { MunicipalitiesController } from './municipalities.controller';

@Module({
    controllers: [MunicipalitiesController],
    providers: [MunicipalitiesService],
    imports: [TypeOrmModule.forFeature([Municipality])],
})
export class MunicipalitiesModule {}



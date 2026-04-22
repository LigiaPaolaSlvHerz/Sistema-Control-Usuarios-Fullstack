
import { Controller, Get, Query } from '@nestjs/common';
import { ClimaService } from './clima.service';

@Controller('clima')
export class ClimaController {
  constructor(private readonly climaService: ClimaService) {}

  @Get('pronostico')
  async getClima(@Query('lat') lat: string, @Query('lon') lon: string) {
    // Convertimos los strings de la URL a números
    return await this.climaService.obtenerClima(Number(lat), Number(lon));
  }
}
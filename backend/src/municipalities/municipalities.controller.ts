import { Controller, Get } from '@nestjs/common';
import { MunicipalitiesService } from './municipalities.service';

@Controller('municipalities')
export class MunicipalitiesController {
    constructor(private readonly service: MunicipalitiesService) {}

  @Get() // URL: GET http://localhost:3000/municipalities
  getMunicipalities() {
    return this.service.findAll();
  }
}

// weather.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private API = 'http://localhost:3000';

  getMunicipalities() {
    return this.http.get<any[]>(`${this.API}/municipalities`);
  }

  getSettlements(municipalityId: number) {
    return this.http.get<any[]>(`${this.API}/settlements/by-municipality/${municipalityId}`);
  }


}

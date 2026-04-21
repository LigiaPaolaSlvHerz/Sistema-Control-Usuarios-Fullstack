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
  getWeatherData(lat: number, lon: number) {
  // Usamos backticks (`) para meter las variables lat y lon en la URL
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability&timezone=auto`;
  return this.http.get<any>(url);
  }

}

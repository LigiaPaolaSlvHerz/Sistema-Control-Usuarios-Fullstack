import { Injectable } from '@nestjs/common';
import { fetchWeatherApi } from 'openmeteo';

@Injectable()
export class ClimaService {
  async obtenerClima(lat: number, lon: number) {
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
      "latitude": lat,
      "longitude": lon,
      "hourly": ["temperature_2m", "relative_humidity_2m", "precipitation_probability", "weather_code", "rain", "showers", "precipitation"],
      "timezone": "auto",
      "forecast_days": 1,
      "past_days":0
    };

    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    // Procesamos los datos como dice la documentación de tu amiga
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly()!;

    // Creamos el objeto que Angular espera recibir
    return {
      hourly: {
        time: Array.from({
          length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
        }, (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)),
        temperature_2m: Array.from(hourly.variables(0)!.valuesArray()!),
        relative_humidity_2m: Array.from(hourly.variables(1)!.valuesArray()!),
        precipitation_probability: Array.from(hourly.variables(2)!.valuesArray()!),
        weather_code: Array.from(hourly.variables(3)!.valuesArray()!),
        rain: Array.from(hourly.variables(4)!.valuesArray()!),
        showers: Array.from(hourly.variables(5)!.valuesArray()!),
        precipitation: Array.from(hourly.variables(6)!.valuesArray()!),
      }
    };
  }
}
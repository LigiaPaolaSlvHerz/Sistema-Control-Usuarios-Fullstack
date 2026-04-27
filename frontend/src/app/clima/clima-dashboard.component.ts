// clima-dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-clima-dashboard',
  standalone: true,
  imports: [BaseChartDirective, DropdownModule, FormsModule],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './clima-dashboard.component.html',
})
export class ClimaDashboardComponent implements OnInit {
  private weatherService = inject(WeatherService);

  alcaldias: any[] = [];
  colonias: any[] = [];

  alcaldiaSeleccionada: any;
  coloniaSeleccionada: any;

  public mensajePronostico: string = '';
  public esProbabilidadAlta: boolean = false;

  public humedadActual: number = 0;
  public nubosidadActual: number = 0;
  public temperaturaActual: number = 0;
  public horaPicoLluvia: string = '--:--';
  public estadoCieloTexto: string = 'Cargando...';
  public iconoActual: string = '☀️';

  // ===================== CHARTS =====================

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Temp (°C)' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Humedad (%)' },
      },
    },
  };

  // Weather Code
  public weatherCodeChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  public weatherCodeChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: 'Código WMO' },
      },
    },
  };

  // Probabilidad
  public probabilidadChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  public probabilidadChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 30,
        left: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left',
        max: 100,
        title: { display: true, text: 'Probabilidad (%)' },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: { display: true, text: 'Presipitacion (mm)' },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  // Lluvia y showers
  public lluviaChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  public lluviaChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 30,
        left: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        title: { display: true, text: 'mm' },
      },
    },
  };

  // ===================== CICLO =====================

  ngOnInit() {
    this.weatherService.getMunicipalities().subscribe((data) => {
      this.alcaldias = data;
    });
  }

  onAlcaldiaChange() {
    if (this.alcaldiaSeleccionada) {
      this.weatherService
        .getSettlements(this.alcaldiaSeleccionada.id)
        .subscribe((data) => {
          this.colonias = data;
          this.coloniaSeleccionada = null;
        });
    }
  }

  onColoniaChange() {
    if (this.coloniaSeleccionada) {
      const { latitude, longitude } = this.coloniaSeleccionada;

      this.weatherService
        .getWeatherData(latitude, longitude)
        .subscribe((data: any) => {
          console.log('Datos del clima recibidos:', data);
          this.prepararGrafica(data.hourly);
        });
    }
  }

  // ===================== LÓGICA =====================

  mapearClima(code: number) {
    if (code === 0) {
      this.estadoCieloTexto = 'Cielo Despejado';
      this.iconoActual = '☀️';
    } else if (code >= 1 && code <= 3) {
      this.estadoCieloTexto = 'Nubes Dispersas';
      this.iconoActual = '🌤️';
    } else if (code >= 45 && code <= 48) {
      this.estadoCieloTexto = 'Niebla';
      this.iconoActual = '🌫️';
    } else if (code >= 51 && code <= 65) {
      this.estadoCieloTexto = 'Lluvia / Llovizna';
      this.iconoActual = '🌧️';
    } else if (code >= 95) {
      this.estadoCieloTexto = 'Tormenta';
      this.iconoActual = '⚡';
    } else {
      this.estadoCieloTexto = 'Nublado';
      this.iconoActual = '☁️';
    }
  }

  prepararGrafica(datosHorarios: any) {
    const ahora = new Date();
    const horaActual = ahora.getHours();

    const probabilidades = datosHorarios.precipitation_probability;
    const maxProb = Math.max(...probabilidades);
    const indiceMax = probabilidades.indexOf(maxProb);
    const horaPico = indiceMax.toString().padStart(2, '0') + ':00';

    const code = datosHorarios.weather_code[horaActual];
    this.mapearClima(code);

    // Pronóstico
    if (maxProb > 50) {
      this.mensajePronostico = `Alta probabilidad de lluvia a las ${horaPico}`;
      this.esProbabilidadAlta = true;
      this.horaPicoLluvia = horaPico;
    } else if (maxProb > 10) {
      this.mensajePronostico = `Poca probabilidad de lluvia hoy (${maxProb}%)`;
      this.esProbabilidadAlta = false;
      this.horaPicoLluvia = horaPico;
    } else {
      this.mensajePronostico = `No hay probabilidad de lluvia hoy`;
      this.esProbabilidadAlta = false;
      this.horaPicoLluvia = '--:--';
    }

    // Valores actuales
    if (datosHorarios.relative_humidity_2m[horaActual] !== undefined) {
      this.humedadActual = Math.round(
        datosHorarios.relative_humidity_2m[horaActual],
      );
      this.nubosidadActual = Math.round(datosHorarios.weather_code[horaActual]);
      this.temperaturaActual = Math.round(
        datosHorarios.temperature_2m[horaActual],
      );
    } else {
      this.humedadActual = Math.round(datosHorarios.relative_humidity_2m[0]);
      this.nubosidadActual = Math.round(datosHorarios.weather_code[0]);
      this.temperaturaActual = Math.round(datosHorarios.temperature_2m[0]);
    }

    const labels = datosHorarios.time.slice(0, 24).map((t: any) =>
      new Date(t).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
      }),
    );

    const temps = datosHorarios.temperature_2m.slice(0, 24);
    const humedad = datosHorarios.relative_humidity_2m.slice(0, 24);

    // Línea principal temperatura y humedad
    this.lineChartData = {
      labels,
      datasets: [
        {
          data: temps,
          label: 'Temperatura',
          yAxisID: 'y',
          borderColor: '#f87171',
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.bottom,
              0,
              chartArea.top,
            );

            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0.5)');

            return gradient;
          },
          fill: true,
          tension: 0.4,
        },
        {
          data: humedad,
          label: 'Humedad',
          yAxisID: 'y1',
          borderColor: '#3b82f6',
          tension: 0.4,
          pointRadius: 0,
        },
      ],
    };

    // Weather Code
    const codes = (datosHorarios.weather_code || []).slice(0, 24);

    this.weatherCodeChartData = {
      labels,
      datasets: [
        {
          data: codes,
          label: 'Estado del Cielo',
          backgroundColor: codes.map((c: number) =>
            c > 50 ? '#5e05a7' : '#c76efa',
          ),
          borderRadius: 5,
        },
      ],
    };

    // Probabilidad
    this.probabilidadChartData = {
      labels,
      datasets: [
        {
          data: (datosHorarios.precipitation_probability || []).slice(0, 24),
          label: 'Probabilidad',
          borderColor: '#fbbf24',
          backgroundColor: 'rgba(251, 191, 36, 0.3)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          data: (datosHorarios.precipitation || []).slice(0, 24),
          label: 'Precipitación',
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.3)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };

    // Lluvia
    const rain = (datosHorarios.rain || []).slice(0, 24);
    const showers = (datosHorarios.showers || []).slice(0, 24);

    this.lluviaChartData = {
      labels,
      datasets: [
        {
          data: rain,
          label: 'Lluvia (mm)',
          backgroundColor: 'rgba(0, 195, 255)',
          fill: true,
          tension: 0.4,
        },
        {
          data: showers,
          label: 'Showers (mm)',
          backgroundColor: 'rgba(25, 255, 243)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }
}

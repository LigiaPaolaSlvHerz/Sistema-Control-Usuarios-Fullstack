// clima-dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-clima-dashboard',
  standalone: true,
  imports: [BaseChartDirective, DropdownModule, FormsModule],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './clima-dashboard.component.html'
})
export class ClimaDashboardComponent implements OnInit {
  private weatherService = inject(WeatherService);

    alcaldias: any[] = [];
    colonias: any[] = [];

    alcaldiaSeleccionada: any;
    coloniaSeleccionada: any;

    public lineChartData: ChartConfiguration['data'] = {
      datasets: [],
      labels: []
    };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Temp (°C)' } },
      y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Humedad (%)' } }
    }
  };

  //Weather Code
public weatherCodeChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
public weatherCodeChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Código WMO' } } }
};

//Probabilidad
public probabilidadChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
public probabilidadChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      right: 30,  // Esto le da 30 pixeles de espacio a la derecha
      left: 10,   // Un poquito a la izquierda también por si las dudas
      top: 10,
      bottom: 10
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      position: 'left',
      max: 100, // La probabilidad siempre es de 0 a 100
      title: { display: true, text: 'Probabilidad (%)' }
    },
    y1: {
      beginAtZero: true,
      position: 'right',
      title: { display: true, text: 'Presipitacion (mm)' },
      grid: {
        drawOnChartArea: false
      }
    }
  }
};
//Lluvia y showers
public lluviaChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
public lluviaChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      right: 30,  // Esto le da 30 pixeles de espacio a la derecha
      left: 10,   // Un poquito a la izquierda también por si las dudas
      top: 10,
      bottom: 10
    }
  },
  scales: {
    x: { },
    y: { beginAtZero: true, title: { display: true, text: 'mm' } }
  }
};

  ngOnInit() {
    // 1. Cargamos las alcaldías al iniciar
    this.weatherService.getMunicipalities().subscribe(data => {
      this.alcaldias = data;
    });
  }

  onAlcaldiaChange() {
    // 2. Cuando cambia la alcaldía, cargamos sus colonias
    if (this.alcaldiaSeleccionada) {
      this.weatherService.getSettlements(this.alcaldiaSeleccionada.id).subscribe(data => {
        this.colonias = data;
        this.coloniaSeleccionada = null; // Reseteamos la colonia anterior
      });
    }
  }
  onColoniaChange() {
    if (this.coloniaSeleccionada) {
      const { latitude, longitude } = this.coloniaSeleccionada;

      this.weatherService.getWeatherData(latitude, longitude).subscribe((data: any) => {
        console.log('Datos del clima recibidos:', data);

        // Aquí es donde "alimentaremos" a la gráfica
        this.prepararGrafica(data.hourly);
      });
    }
  }
  prepararGrafica(datosHorarios: any) {
    //
    const labels = datosHorarios.time.slice(0, 24).map((t: any) => {
      return new Date(t).toLocaleTimeString('es-MX', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });
    });
  const temps = datosHorarios.temperature_2m.slice(0, 24);
  const humedad = datosHorarios.relative_humidity_2m.slice(0, 24);

  this.lineChartData = {
    labels: labels,
    datasets: [
      {
        data: temps,
        label: 'Temperatura',
        yAxisID: 'y',
        borderColor: '#f87171',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0.5)');
          return gradient;
        },
        fill: true,
        tension: 0.4
      },
      {
        data: humedad,
        label: 'Humedad',
        yAxisID: 'y1',
        borderColor: '#3b82f6',
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };
  const codes = (datosHorarios.weather_code || []).slice(0, 24);
  this.weatherCodeChartData = {
    labels: labels,
    datasets: [{
      data: codes,
      label: 'Estado del Cielo',
      // Mientras nubes hay mas obscuro se vuelve
      backgroundColor: codes.map((c: number) => c > 50 ? '#5e05a7' : '#c76efa'),
      borderRadius: 5
    }]
  };

  this.probabilidadChartData = {
  labels: labels,
  datasets: [
    {
      data: (datosHorarios.precipitation_probability|| []).slice(0, 24),
      label: 'Probabilidad',
      borderColor: '#fbbf24', // Amarillo
      backgroundColor: 'rgba(251, 191, 36, 0.3)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y' // Eje normal a la izquierda
    },
    {
      data: (datosHorarios.precipitation|| []).slice(0, 24),
      label: 'Precipitación',
      borderColor: '#60a5fa', // Azul claro
      backgroundColor: 'rgba(96, 165, 250, 0.3)',
      fill: true,
      tension: 0.4,
      yAxisID: 'y1' // <--- Eje nuevo a la derecha
    }
  ]
};
  const rain = (datosHorarios.rain || []).slice(0, 24);
  const showers = (datosHorarios.showers || []).slice(0, 24);
  this.lluviaChartData = {
    labels: labels,
    datasets: [
      {
        data: rain,
        label: 'Lluvia (mm)',
        backgroundColor: 'rgba(0, 195, 255)', // Color
        fill: true, // Esto la convierte en gráfica de área
        tension: 0.4 // Suaviza la línea
      },
      {
        data: showers,
        label: 'Showers (mm)',
        backgroundColor: 'rgba(25, 255, 243)',
      fill: true,
      tension: 0.4
      }
    ]
  };
}
}

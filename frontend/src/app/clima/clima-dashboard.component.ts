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

  // Gráfica 2: Weather Code (Barras)
public weatherCodeChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
public weatherCodeChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'Código WMO' } } }
};

// Gráfica 3: Probabilidad (Área suave)
public probabilidadChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
public probabilidadChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: { y: { min: 0, max: 100, title: { display: true, text: '%' } } }
};

// Gráfica 4: Lluvia y Chubascos (Barras Apiladas)
public lluviaChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
public lluviaChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
        hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    });
  const temps = datosHorarios.temperature_2m.slice(0, 24);
  const humedad = datosHorarios.relative_humidity_2m.slice(0, 24);
  const probabilidadPresipitacion = datosHorarios.precipitation_probability.slice(0, 24);

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
      // Mapeamos: si el código es alto (tormenta), el gris es más oscuro
      backgroundColor: codes.map((c: number) => c > 50 ? '#4b5563' : '#9ca3af'),
      borderRadius: 5
    }]
  };
  this.probabilidadChartData = {
    labels: labels,
    datasets: [{
      data: datosHorarios.precipitation_probability.slice(0, 24),
      label: 'Probabilidad %',
      borderColor: '#fbbf24', // Amarillo/Naranja
      backgroundColor: 'rgba(251, 191, 36, 0.3)',
      fill: true,
      tension: 0.4
    }]
  };
  const rain = (datosHorarios.rain || []).slice(0, 24);
  const showers = (datosHorarios.showers || []).slice(0, 24);
  this.lluviaChartData = {
    labels: labels,
    datasets: [
      {
        data: rain,
        label: 'Lluvia (mm)',
        backgroundColor: 'rgba(96, 165, 250, 0.2)', // Color con transparencia
        fill: true, // Esto la convierte en gráfica de área
        tension: 0.4 // Suaviza la línea
      },
      {
        data: showers,
        label: 'Chubascos (mm)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      fill: true,
      tension: 0.4
      }
    ]
  };
}
}

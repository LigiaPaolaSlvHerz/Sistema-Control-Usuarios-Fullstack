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

      this.weatherService.getWeatherData(latitude, longitude).subscribe(data => {
        console.log('Datos del clima recibidos:', data);

        // Aquí es donde "alimentaremos" a la gráfica
        this.prepararGrafica(data.hourly);
      });
    }
  }
  prepararGrafica(datosHorarios: any) {
  // 1. Cortamos los datos para mostrar solo las próximas 24 horas (opcional pero recomendado)
  const labels = datosHorarios.time.slice(0, 24).map((t: string) => t.split('T')[1]);
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
  this.lineChartData = {
    labels: labels,
    datasets: [
      {
        data: probabilidadPresipitacion,
        label: 'Probabilidad ',
        yAxisID: 'y',
        borderColor: '#ff8800'
      }
    ]
  }
}
}

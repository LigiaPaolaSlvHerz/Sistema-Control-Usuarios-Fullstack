// clima-dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clima-dashboard',
  standalone: true,
  imports: [DropdownModule, FormsModule],
  templateUrl: './clima-dashboard.component.html'
})
export class ClimaDashboardComponent implements OnInit {
  private weatherService = inject(WeatherService);

  alcaldias: any[] = [];
  colonias: any[] = [];

  alcaldiaSeleccionada: any;
  coloniaSeleccionada: any;

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
}

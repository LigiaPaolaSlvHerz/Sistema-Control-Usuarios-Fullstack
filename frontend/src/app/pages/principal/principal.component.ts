import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { RouterOutlet } from '@angular/router';
import { ClimaDashboardComponent } from '../../clima/clima-dashboard.component';
@Component({
  selector: 'app-principal',
  standalone: true,
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css',
  imports: [ButtonModule, InputTextModule, CheckboxModule, RouterOutlet, ClimaDashboardComponent,],
})



export class PrincipalPage {

}

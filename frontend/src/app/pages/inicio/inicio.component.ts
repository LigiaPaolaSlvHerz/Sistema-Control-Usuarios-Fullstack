import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  imports: [ButtonModule, InputTextModule, CheckboxModule, FormsModule ],
})


export class InicioPage {
  email: string = '';
  password: string = '';
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

login() {
  const data = {
    email: this.email,
    password: this.password
  };

  this.authService.login(data).subscribe({
    next: (res: any) => {
      console.log('TOKEN:', res.access_token);

      localStorage.setItem('token', res.access_token);
      this.router.navigate(['/principal']);
    },
    error: (err) => {
      console.error('Error login', err);
    }
  });
}
}

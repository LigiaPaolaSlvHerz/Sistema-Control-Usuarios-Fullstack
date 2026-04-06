import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
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
  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  username: string = '';
  confirmPassword: string = '';
  isLoginMode: boolean = true;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  showPassword = false
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
register(){
  this.isLoginMode = false;
}
registerUser() {
  const registerData = {
    first_name: this.firstName,
    middle_name: this.middleName,
    last_name: this.lastName,
    username: this.username,
    email: this.email, // Ya la tenías del login
    password: this.password // Ya la tenías del login
  };

  this.authService.register(registerData).subscribe({
    next: (res) => {
      console.log('¡Registro exitoso!', res);
      this.isLoginMode = true; // Regresa al login automáticamente tras registrarse
    },
    error: (err) => console.error('Error al registrar', err)
  });
}
showLogin() {
  this.isLoginMode = true;
}
togglePassword(input: HTMLInputElement) {
  input.type = input.type === 'password' ? 'text' : 'password';
  this.showPassword = !this.showPassword;
}
}

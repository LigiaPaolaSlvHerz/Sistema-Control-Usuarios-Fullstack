import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:3000/auth';
  private router = inject(Router);

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.API}/login`, data);

  }
  register(userData: any) {
  return this.http.post(`${this.API}/register`, userData);
  }
  logout() {
    //Se borran los tokens
    localStorage.clear();
    // Nos vamos al login
    this.router.navigate(['/login']);
  }
  getUserRole(): string {
    const token = localStorage.getItem('access_token');
    if (!token) return '';

    try {
      const decoded: any = jwtDecode(token);
      return decoded.role; // Aquí sacamos el rol que metimos en el paso 1
    } catch (error) {
      return '';
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }




  getUserPermissions(): string[] {
    const token = localStorage.getItem('access_token');
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      // Asegúrate que tu Backend mande un arreglo llamado 'permissions'
      return decoded.permissions || [];
    } catch (error) {
      return [];
    }
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions();
    return permissions.includes(permission);
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private API = 'http://localhost:3000/users';

  constructor() { }
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/roles'); // Ajusta si tu ruta es diferente
  }

  // Método para enviar el nuevo usuario al backend
  crearUsuario(userData: any): Observable<any> {
    // Aquí usamos la misma URL que el findAll pero con POST
    return this.http.post<any>('http://localhost:3000/users', userData);
  }
  updateUsuario(id: number, data: any): Observable<any> {
  // Usamos patch porque solo vamos a actualizar algunos campos
  return this.http.put(`http://localhost:3000/users/${id}`, data);
  }
  removeUsuario(id: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/users/${id}`);
  }

  // En usuario.service.ts

  crearRol(data: any): Observable<any> {
    return this.http.post('http://localhost:3000/roles', data);
  }

  updateRol(id: number, data: any): Observable<any> {
    return this.http.patch(`http://localhost:3000/roles/${id}`, data);
  }

  removeRol(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/roles/${id}`);
  }
}

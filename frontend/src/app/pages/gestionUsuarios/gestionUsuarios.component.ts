import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from "primeng/button";
import { UsuarioService } from '../../services/usuario.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    ButtonModule,
    DialogModule
],
  templateUrl: './gestionUsuarios.component.html',
  styleUrls: ['./gestionUsuarios.component.css']
})
export class gestionUsuariosPage implements OnInit {

  private usuarioService = inject(UsuarioService);

  usuarios: any[] = [];
  representatives: any[] = [];
  statuses: any[] = [];
  loading: boolean = false;
  display: boolean = false; // Controla si se ve el diálogo
  rolesDisponibles: any[] = []; // Para llenar el dropdown de roles
  nuevoUsuario: any = {
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    role_id: null
  };

  ngOnInit() {

    this.statuses = [
      { label: 'Activo', value: 'activo' },
      { label: 'Inactivo', value: 'inactivo' }
    ];

    this.obtenerUsuariosDeBase();
    this.cargarRoles();
  }

  obtenerUsuariosDeBase() {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        // 3. Mapeamos los datos de NestJS (snake_case) a tu tabla (camelCase)
        this.usuarios = data.map(u => ({
          username: u.username,
          nombre: u.first_name,      // Viene de tu user.entity.ts
          apellido_p: u.middle_name,   // Viene de tu user.entity.ts
          apellido_m: u.last_name, // Viene de tu user.entity.ts
          rol: u.role?.role || 'Sin Rol', // Si incluiste la relación en el backend
          status: u.active ? 'activo' : 'inactivo'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al conectar con SEGIAGUA:', err);
        this.loading = false;
      }
    });
  }

  getSeverity(status: string) {
    switch (status) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
      default:
        return 'secondary';
    }
  }
  // 1. Abrir el diálogo
  showDialog() {
    this.display = true;
  }

  // 2. Cargar roles desde tu base (necesitas un método en tu servicio que haga GET /roles)
  cargarRoles() {
    // Aquí puedes usar un servicio de roles o el mismo usuarioService si le agregas el método
    this.usuarioService.getRoles().subscribe({
      next: (res) => this.rolesDisponibles = res,
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  // 3. Guardar el usuario con el ID del administrador logueado
  guardarUsuario() {
    // Recuperamos los datos del admin que están guardados en el navegador
    const userLogueado = JSON.parse(localStorage.getItem('user') || '{}');
    const adminId = userLogueado.id;

    if (!adminId) {
      console.error('No se encontró el ID del administrador');
      return;
    }

    // Agregamos el created_by al objeto antes de enviarlo
    const dataAEnviar = {
      ...this.nuevoUsuario,
      created_by: adminId
    };

    this.usuarioService.crearUsuario(dataAEnviar).subscribe({
      next: (res) => {
        console.log('¡Usuario creado con éxito!');
        this.display = false; // Cerramos el modal
        this.obtenerUsuariosDeBase(); // Recargamos la tabla
        this.limpiarFormulario(); // Limpiamos los campos
      },
      error: (err) => console.error('Error al crear usuario', err)
    });
  }

  limpiarFormulario() {
    this.nuevoUsuario = { first_name: '', middle_name: '', last_name: '', username: '', email: '', password: '', role_id: null };
  }
}

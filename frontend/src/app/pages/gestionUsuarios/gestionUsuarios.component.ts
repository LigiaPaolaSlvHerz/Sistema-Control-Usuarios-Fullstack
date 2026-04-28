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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { HasPermissionDirective } from "../../directives/has-permission.directive";

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
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    HasPermissionDirective
],
  providers: [MessageService],
  templateUrl: './gestionUsuarios.component.html',
  styleUrls: ['./gestionUsuarios.component.css']
})
export class gestionUsuariosPage implements OnInit {

  private usuarioService = inject(UsuarioService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

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
  isEditMode: boolean = false; // Nos dice si es edición o creación
  usuarioIdAEditar: number | null = null; // Guarda el ID de a quién editamos

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
          id: u.id,
          username: u.username,
          nombre: u.first_name,      // Viene de tu user.entity.ts
          apellido_p: u.middle_name,   // Viene de tu user.entity.ts
          apellido_m: u.last_name, // Viene de tu user.entity.ts
          email: u.email,
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
    this.isEditMode = false;
    this.limpiarFormulario();
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
  editarUsuario(user: any) {
  this.isEditMode = true;
  this.usuarioIdAEditar = user.id;
  this.display = true; // Abre el modal igual que cuando agregas uno nuevo

  // Ponemos los datos de la tabla en el formulario
  this.nuevoUsuario = {
    first_name: user.nombre,
    middle_name: user.apellido_p,
    last_name: user.apellido_m,
    username: user.username,
    email: user.email,
    role_id: this.rolesDisponibles.find(r => r.role === user.rol)?.id,
    password: '' // Se queda vacío por seguridad
  };
}

  // 3. Guardar el usuario con el ID del administrador logueado
  guardarUsuario() {
    // Recuperamos los datos del admin que están guardados en el navegador
    const userLogueado = JSON.parse(localStorage.getItem('user') || '{}');
    const adminId = userLogueado.id;

if (this.isEditMode) {
    // --- LÓGICA DE EDITAR ---

    // 1. Clonamos los datos para no afectar lo que el usuario ve en el modal
    const dataAEnviar = { ...this.nuevoUsuario, updated_by: adminId };

    // 2. Si la contraseña viene vacía o son solo espacios, la eliminamos del envío
    if (!dataAEnviar.password || dataAEnviar.password.trim() === '') {
      delete dataAEnviar.password;
    }
    this.usuarioService.updateUsuario(this.usuarioIdAEditar!, dataAEnviar).subscribe({
      next: (res) => {
        this.messageService.add({
        severity: 'info',
        summary: 'Actualizado',
        detail: 'Los datos del usuario se actualizaron'
        });
        this.display = false;
        this.obtenerUsuariosDeBase();
        this.limpiarFormulario();
      },
      error: (err) => console.error('Error al editar', err)
    });

  } else {

    // Agregamos el created_by al objeto antes de enviarlo
    const dataAEnviar = {
      ...this.nuevoUsuario,
      created_by: adminId
    };

    this.usuarioService.crearUsuario(dataAEnviar).subscribe({
      next: (res) => {
        this.messageService.add({
        severity: 'success',
        summary: '¡Éxito!',
        detail: 'Usuario creado correctamente',
        life: 3000 // 3000 milisegundos = se quita solo en 3 segundos
        });
        this.display = false; // Cerramos el modal
        this.obtenerUsuariosDeBase(); // Recargamos la tabla
        this.limpiarFormulario(); // Limpiamos los campos
      },
      error: (err) => console.error('Error al crear usuario', err)
    });
    }
  }

  limpiarFormulario() {
    this.nuevoUsuario = { first_name: '', middle_name: '', last_name: '', username: '', email: '', password: '', role_id: null };
  }

  confirmarEliminacion(user: any) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar a ${user.nombre}?`,
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'No, cancelar',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.eliminarUsuario(user.id);
            }
        });
    }
    eliminarUsuario(id: number) {
        this.usuarioService.removeUsuario(id).subscribe({
            next: () => {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Eliminado',
                  detail: 'El usuario fue removido del sistema'
                });
                console.log('Usuario eliminado');
                this.obtenerUsuariosDeBase(); // Recargamos la tabla
            },
            error: (err) => console.error('Error al eliminar:', err)
        });
    }
}

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
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { HasPermissionDirective } from "../../directives/has-permission.directive";

@Component({
  selector: 'app-gestion-roles',
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
    CheckboxModule,
    ToastModule,
    HasPermissionDirective
],
  providers: [MessageService],
  templateUrl: './gestionRoles.component.html',
  styleUrls: ['./gestionRoles.component.css']
})
export class gestionRolesPage implements OnInit {

  private usuarioService = inject(UsuarioService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  roles: any[] = [];
  loading: boolean = false;
  display: boolean = false; // Controla si se ve el diálogo
  isEditMode: boolean = false;
  rolIdAEditar: number | null = null;
  nuevoRol: any = {
    role: '',
    permisos: [],
    active: true
  };
  permisosDisponibles: any[] = [];
  displayPermisos: boolean = false;
  rolSeleccionado: any = null;

  ngOnInit() {

    this.obtenerRolesDeBase();
    this.obtenerRolesDeBase();
    this.cargarPermisos();
  }

  obtenerRolesDeBase() {
    this.loading = true;
    this.usuarioService.getRoles().subscribe({
      next: (data) => {
        // Mapeamos los campos que vienen de tu base de datos de roles
        console.log('Datos que llegan de SEGIAGUA:', data);
        this.roles = data.map(r => ({
          id: r.id,
          role: r.role,
          status: r.active ? 'activo' : 'inactivo',
          permissions: r.permissions || []
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar roles en SEGIAGUA:', err);
        this.loading = false;
      }
    });
  }
  // 1. Abrir el diálogo
  showDialog() {
    this.isEditMode = false;
    this.limpiarFormulario();
    this.display = true;
  }

  // 2. Cargar roles desde tu base (necesitas un método en tu servicio que haga GET /roles)
  editarRol(rol: any) {
    this.isEditMode = true;
    this.rolIdAEditar = rol.id;
    this.display = true;

    const permisosIds = rol.permissions ? rol.permissions.map((p: any) => p.id) : [];

    this.nuevoRol = {
      role: rol.role,
      active: rol.status === 'activo',
      permisos: permisosIds
    };
  }
  getSeverity(status: string) {
    switch (status) {
        case 'activo':
            return 'success';  // Color verde
        case 'inactivo':
            return 'danger';   // Color rojo
        default:
            return 'secondary'; // Color gris
    }
}

  guardarRol() {
    if (this.isEditMode) {
      // Lógica para actualizar un rol
      this.usuarioService.updateRol(this.rolIdAEditar!, this.nuevoRol).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Actualizado',
            detail: 'Los datos del rol se actualizaron'
          });
          this.finalizarAccion();
        },
        error: (err) => console.error('Error al editar rol', err)
      });
    } else {
      // Lógica para crear un rol
      this.usuarioService.crearRol(this.nuevoRol).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Rol creado correctamente',
            life: 3000
          });
          this.finalizarAccion();
        },
        error: (err) => console.error('Error al crear rol', err)
      });
    }
  }

  finalizarAccion() {
    this.display = false;
    this.obtenerRolesDeBase();
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.nuevoRol = { role: '', active: true};
  }

  confirmarEliminacion(rol: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar el rol ${rol.role}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'No, cancelar',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.eliminarRol(rol.id);
      }
    });
  }
  eliminarRol(id: number) {
    this.usuarioService.removeRol(id).subscribe({
      next: () => {
        this.messageService.add({
            severity: 'warn',
            summary: 'Eliminado',
            detail: 'El rol fue removido del sistema'
          });
        this.obtenerRolesDeBase();
      },
      error: (err) => console.error('Error al eliminar rol', err)
    });
  }
  cargarPermisos() {
    this.usuarioService.getPermisos().subscribe({
      next: (res) => {
        this.permisosDisponibles = res;
      },
      error: (err) => console.error('No pude cargar los permisos:', err)
    });
  }
  verPermisos(rol: any) {
    this.rolSeleccionado = rol;
    this.displayPermisos = true;
  }

}

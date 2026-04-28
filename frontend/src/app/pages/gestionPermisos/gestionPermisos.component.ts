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
  selector: 'app-gestion-permisos',
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
  templateUrl: './gestionPermisos.component.html',
  styleUrls: ['./gestionPermisos.component.css']
})
export class gestionPermisosPage implements OnInit {

  private permisoService = inject(UsuarioService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  permisos: any[] = [];
  loading: boolean = false;
  display: boolean = false;
  statuses: any[] = [];
  nuevoPermiso: any = {
    permission: '',
    description: ''
  };
  isEditMode: boolean = false; // Nos dice si es edición o creación
  permisoIdAEditar: number | null = null; // Guarda el ID de a quién editamos

  ngOnInit() {

    this.obtenerPermisosDeBase();
  }

  obtenerPermisosDeBase() {
    this.loading = true;
    this.permisoService.getPermisos().subscribe({
      next: (data) => {
        this.permisos = data.map(p => ({
          id: p.id,
          nombre: p.permission,
          descripcion: p.description,
          status: p.active ? 'activo' : 'inactivo'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar permisos:', err);
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

  editarPermiso(permiso: any) {
    this.isEditMode = true;
    this.permisoIdAEditar = permiso.id;
    this.display = true;

    this.nuevoPermiso = {
      permission: permiso.nombre,
      description: permiso.descripcion
    };
  }

  guardarPermiso() {
    const userLogueado = JSON.parse(localStorage.getItem('user') || '{}');
    const adminId = userLogueado.id;

    if (this.isEditMode) {
      this.permisoService.updatePermission(this.permisoIdAEditar!, { ...this.nuevoPermiso, updated_by: adminId }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Actualizado',
            detail: 'Los datos del permiso se actualizaron'
          });
          this.finalizarAccion();
        },
        error: (err) => console.error('Error al editar permiso', err)
      });
    } else {
      this.permisoService.createPermission({ ...this.nuevoPermiso, created_by: adminId }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Éxito!',
            detail: 'Permiso creado correctamente',
            life: 3000
          });
        this.finalizarAccion();
        },
        error: (err) => console.error('Error al crear permiso', err)
      });
    }
  }

  // Función auxiliar para no repetir código
  finalizarAccion() {
    this.display = false;
    this.obtenerPermisosDeBase();
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.nuevoPermiso = { permission: '', description: ''};
  }
  confirmarEliminacion(permiso: any) {
  this.confirmationService.confirm({
    message: `¿Estás seguro de que deseas eliminar el permiso ${permiso.nombre}?`,
    header: 'Confirmar Eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      this.permisoService.deletePermission(permiso.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Eliminado',
            detail: 'El permiso fue removido del sistema'
          });
          this.finalizarAccion();
        },
        error: (err: any) => console.error('Error al eliminar', err)
      });
    }
  });
}
}

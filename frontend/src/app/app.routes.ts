import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio/inicio.component';
import { PrincipalPage } from './pages/principal/principal.component';
import { LayoutComponent } from './layout/layout.component';
import { gestionUsuariosPage } from './pages/gestionUsuarios/gestionUsuarios.component';
import { gestionRolesPage } from './pages/gestionRoles/gestionRoles.component';
import { gestionPermisosPage } from './pages/gestionPermisos/gestionPermisos.component';
import { permissionGuard } from './auth/guards/permission.guard';


export const routes: Routes = [

  {
    path: '',
    component: InicioPage,
  },
  {
   path:'',
     component: LayoutComponent,
     children:[
      {
      path: 'principal',
      component: PrincipalPage,
      canActivate: [permissionGuard],
      data: { permissions: ['VIEW_HOME', 'VIEW_MANAGEMENT']}
      },
      {
      path: 'usuarios',
      component: gestionUsuariosPage,
      canActivate: [permissionGuard],
      data: {permissions: ['READ_USER']}
      },
      {
      path: 'roles',
      component: gestionRolesPage,
      canActivate: [permissionGuard],
      data: {permissions: ['READ_ROLE']}
      },
      {
      path: 'permisos',
      component: gestionPermisosPage,
      canActivate: [permissionGuard],
      data: {permissions: ['READ_PERMISSION']}
      },
    ]
  },

  {
    path: '**',
    component: InicioPage,
  }
];

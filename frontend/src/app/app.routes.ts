import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio/inicio.component';
import { PrincipalPage } from './pages/principal/principal.component';
import { LayoutComponent } from './layout/layout.component';
import { gestionUsuariosPage } from './pages/gestionUsuarios/gestionUsuarios.component';
import { gestionRolesPage } from './pages/gestionRoles/gestionRoles.component';


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
      },
      {
      path: 'usuarios',
      component: gestionUsuariosPage,
      },
      {
      path: 'roles',
      component: gestionRolesPage,
      },
    ]
  },

  {
    path: '**',
    component: InicioPage,
  }
];

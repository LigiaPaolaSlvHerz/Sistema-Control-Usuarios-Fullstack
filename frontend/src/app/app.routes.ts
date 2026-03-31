import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio/inicio.component';
import { PrincipalPage } from './pages/principal/principal.component';
import { AppLayout } from './Layout/component/app.layout';

export const routes: Routes = [

  {
    path: '',
    component: InicioPage,
  },
  {
    path:'',
    component: AppLayout,
    children:[
      {
      path: 'principal',
      component: PrincipalPage,
      }
    ]
  },

  {
    path: '**',
    component: InicioPage,
  }
];

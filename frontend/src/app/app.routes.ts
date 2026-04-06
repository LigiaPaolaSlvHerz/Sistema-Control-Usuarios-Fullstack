import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio/inicio.component';
import { PrincipalPage } from './pages/principal/principal.component';
import { LayoutComponent } from './layout/layout.component';


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
    ]
  },

  {
    path: '**',
    component: InicioPage,
  }
];

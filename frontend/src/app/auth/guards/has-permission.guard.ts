import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const hasPermissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();

  // 2. Obtenemos los roles permitidos para esta ruta (los definiremos en app.routes.ts)
  const allowedRoles = route.data['roles'] as Array<string>;

  // 3. Verificamos si el usuario está logueado y si su rol está en la lista permitida
  if (authService.isLoggedIn() && allowedRoles.includes(userRole)) {
    return true; // Acceso concedido
  }

  // 4. Si no tiene permiso, lo mandamos al inicio
  alert('No tienes permisos para acceder a esta sección');
  router.navigate(['/inicio']);
  return false;
};

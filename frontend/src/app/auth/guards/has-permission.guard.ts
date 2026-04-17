import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const hasPermissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();

  const allowedRoles = route.data['roles'] as Array<string>;


  if (authService.isLoggedIn() && allowedRoles.includes(userRole)) {
    return true; // Acceso concedido
  }

  alert('No tienes permisos');
  router.navigate(['/inicio']);
  return false;
};

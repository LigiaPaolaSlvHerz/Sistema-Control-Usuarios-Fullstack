import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Leemos 'permissions' (plural) que pusiste en app.routes.ts
  const required = route.data['permissions'];

  // Si la ruta no pide nada, dejamos pasar
  if (!required) return true;

  // 2. LÓGICA DE VALIDACIÓN (Súper importante)
  let tienePermiso = false;

  if (Array.isArray(required)) {
    // Si es una lista, basta con que tenga AL MENOS UNO de los permisos
    tienePermiso = required.some(p => authService.hasPermission(p));
  } else {
    // Si por algo pusiste un solo texto, lo revisamos normal
    tienePermiso = authService.hasPermission(required);
  }

  if (tienePermiso) {
    return true;
  }

  // 3. REDIRECCIÓN SEGURA
  // No redirijas a '/principal' porque esa también tiene Guard y harás un ciclo infinito.
  // Mándalo a la raíz o al login.
  alert('No tienes permisos suficientes para entrar aquí.');
  return false;
};

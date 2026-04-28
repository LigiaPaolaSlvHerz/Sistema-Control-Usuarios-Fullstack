import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true // Muy importante para usarla fácil en Angular 17/18
})
export class HasPermissionDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  @Input() set appHasPermission(permission: string) {
    // Si el AuthService dice que SÍ tiene el permiso...
    if (this.authService.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Si NO, limpiamos el contenedor (el botón desaparece)
      this.viewContainer.clear();
    }
  }
}

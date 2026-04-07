import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  userName: string = 'User';
  fullName: string = 'Full Name';
  userInitial: string = 'U';

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Datos del usuario en LocalStorage:', user);

    if (user) {
      this.userName = user.username || 'No user';
      this.fullName = `${user.first_name || ''} ${user.last_name || ''}`;
      this.userInitial = user.username.charAt(0).toUpperCase();
    }

  }
}

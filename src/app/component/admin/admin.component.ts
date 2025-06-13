import { Component, inject } from '@angular/core';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private userService = inject(UserService);

  searchQuery = '';
  searchResult: any = null;
  adminPassword = '';

  cleanUsers() {
    if (!this.adminPassword.trim()) {
      alert('Por favor ingrese su contraseña de administrador.');
      return;
    }

    this.userService.clean(this.adminPassword).subscribe({
      next: () => {
        alert('Usuarios eliminados correctamente');
        this.adminPassword = '';
      },
      error: (err) => {
        console.error('Error al limpiar usuarios', err);
        alert('Error: contraseña inválida o sesión terminada.');
      }
    });
  }

  cleanNews() {
    console.log('Simulación: limpiar noticias');
    alert('Noticias eliminadas correctamente (simulación)');
  }

  searchUser() {
    if (!this.searchQuery.trim()) return;

    this.userService.getAll().subscribe(users => {
      const found = users.find(user =>
        user.email.includes(this.searchQuery) || user.name.includes(this.searchQuery)
      );
      this.searchResult = found || 'No se encontró el usuario';
    });
  }
}

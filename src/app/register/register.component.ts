import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h2>Crear cuenta</h2>

    <form (ngSubmit)="onSubmit()">
      <input type="email" placeholder="Correo" [(ngModel)]="email" name="email">
      <input type="password" placeholder="Contraseña" [(ngModel)]="password" name="password">
      <button type="submit">Registrarse</button>
    </form>

    <p *ngIf="error" style="color:red">{{ error }}</p>
  `
})
export class RegisterComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';

    this.authService.register(this.email, this.password)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(err => {
        this.error = this.getErrorMessage(err.code);
      });
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      default:
        return 'Error al registrarse.';
    }
  }
}

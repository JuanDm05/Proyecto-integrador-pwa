import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="password-container">

      <h2>Cambiar contraseña</h2>

      <form [formGroup]="form" (ngSubmit)="changePassword()">

        <!-- Contraseña actual -->
        <div class="form-group">
          <label>Contraseña actual</label>
          <input type="password" formControlName="currentPassword">
          <small *ngIf="form.get('currentPassword')?.touched && form.get('currentPassword')?.hasError('required')">
            La contraseña actual es obligatoria.
          </small>
        </div>

        <!-- Nueva contraseña -->
        <div class="form-group">
          <label>Nueva contraseña</label>
          <input type="password" formControlName="newPassword">

          <small *ngIf="form.get('newPassword')?.touched && form.get('newPassword')?.hasError('required')">
            La nueva contraseña es obligatoria.
          </small>

          <small *ngIf="form.get('newPassword')?.touched && form.get('newPassword')?.hasError('minlength')">
            Debe tener al menos 6 caracteres.
          </small>

          <small *ngIf="form.get('newPassword')?.touched && form.get('newPassword')?.hasError('pattern')">
            Debe incluir mayúsculas, minúsculas y números.
          </small>
        </div>

        <!-- Botón -->
        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? 'Actualizando...' : 'Cambiar contraseña' }}
        </button>

      </form>

      <!-- Mensajes -->
      <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

    </div>
  `,
  styles: [`
    .password-container {
      max-width: 400px;
      margin: auto;
      padding: 25px;
      border-radius: 15px;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    h2 {
      margin-bottom: 20px;
      text-align: center;
    }

    .form-group {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }

    input {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
    }

    button {
      width: 100%;
      padding: 12px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }

    button:disabled {
      background: #8bc34a;
      cursor: not-allowed;
    }

    .error {
      color: #e53935;
    }

    .success {
      color: #4caf50;
    }
  `]
})
export class ChangePasswordComponent {

  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
        ]
      ]
    });
  }

  async changePassword() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const { currentPassword, newPassword } = this.form.value;

    try {
      await this.authService.changePassword(currentPassword, newPassword);
      this.successMessage = 'La contraseña se actualizó correctamente.';
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/wrong-password')
        this.errorMessage = 'La contraseña actual es incorrecta.';
      else if (error.code === 'auth/weak-password')
        this.errorMessage = 'La nueva contraseña es demasiado débil.';
      else
        this.errorMessage = 'Error al actualizar la contraseña.';
    }

    this.loading = false;
  }
}

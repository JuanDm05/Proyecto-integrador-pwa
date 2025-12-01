import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">

      <h2>Recuperar contraseña</h2>

      <form [formGroup]="form" (ngSubmit)="sendReset()">

        <div class="form-group">
          <label>Correo electrónico</label>
          <input type="email" formControlName="email">

          <small *ngIf="form.get('email')?.touched && form.get('email')?.hasError('required')">
            El correo es obligatorio.
          </small>

          <small *ngIf="form.get('email')?.touched && form.get('email')?.hasError('email')">
            Ingresa un correo válido.
          </small>
        </div>

        <button type="submit" [disabled]="form.invalid || loading">
          {{ loading ? "Enviando..." : "Enviar enlace de recuperación" }}
        </button>

      </form>

      <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>

    </div>
  `,
  styles: [`
    .container {
      max-width: 400px;
      margin: auto;
      padding: 25px;
      border-radius: 15px;
      background: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
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
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }

    button:disabled {
      background: #90CAF9;
      cursor: not-allowed;
    }

    .success {
      color: #4caf50;
      margin-top: 10px;
    }

    .error {
      color: #e53935;
      margin-top: 10px;
    }
  `]
})
export class ForgotPasswordComponent {

  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async sendReset() {
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = true;

    const email = this.form.value.email;

    try {
      await this.authService.resetPassword(email);
      this.successMessage = 'Se envió un enlace de recuperación a tu correo.';
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/user-not-found')
        this.errorMessage = 'No existe un usuario con ese correo.';
      else
        this.errorMessage = 'Error al enviar el enlace.';
    }

    this.loading = false;
  }
}

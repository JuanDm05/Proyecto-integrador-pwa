import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="password-app">
      <!-- Content -->
      <main class="password-content">
        <div class="password-container">
          <!-- Contenedor del Logo (Manzana) -->
          <div class="logo-wrapper">
            <img src="https://i.ibb.co/nq7Zh7HQ/manzana.png" class="app-logo" alt="manzana" border="0">
          </div>

          <!-- Mensaje de Bienvenida -->
          <div class="welcome-message">
            Cambia tu contraseña en <span class="app-name">FitIaApp</span>
          </div>

          <!-- Título Principal -->
          <h1 class="title">Cambiar Contraseña</h1>

          <!-- Formulario -->
          <form class="password-form" [formGroup]="form" (ngSubmit)="changePassword()">
            <!-- Lista de Inputs -->
            <div class="input-list">
              <!-- Contraseña actual -->
              <div class="input-item" [class.item-has-focus]="currentPasswordFocused">
                <input 
                  type="password" 
                  formControlName="currentPassword"
                  placeholder="Contraseña actual"
                  class="form-input"
                  (focus)="currentPasswordFocused = true"
                  (blur)="currentPasswordFocused = false"
                  required
                >
                <div class="error-message" *ngIf="form.get('currentPassword')?.touched && form.get('currentPassword')?.hasError('required')">
                  La contraseña actual es obligatoria
                </div>
              </div>
              
              <!-- Nueva contraseña -->
              <div class="input-item" [class.item-has-focus]="newPasswordFocused">
                <input 
                  type="password" 
                  formControlName="newPassword"
                  placeholder="Nueva contraseña"
                  class="form-input"
                  (focus)="newPasswordFocused = true"
                  (blur)="newPasswordFocused = false"
                  required
                >
                <div class="password-requirements" *ngIf="newPasswordFocused || form.get('newPassword')?.touched">
                  <div class="requirement" [class.valid]="hasMinLength()">
                    • Al menos 6 caracteres
                  </div>
                  <div class="requirement" [class.valid]="hasUpperCase()">
                    • Al menos una mayúscula
                  </div>
                  <div class="requirement" [class.valid]="hasLowerCase()">
                    • Al menos una minúscula
                  </div>
                  <div class="requirement" [class.valid]="hasNumber()">
                    • Al menos un número
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón Principal -->
            <button 
              type="submit" 
              class="main-button" 
              [disabled]="form.invalid || loading"
              [class.loading]="loading"
            >
              <span class="button-text" *ngIf="!loading">Cambiar Contraseña</span>
              <span class="loading-text" *ngIf="loading">
                <span class="loading-dots"></span>
                Actualizando...
              </span>
            </button>
          </form>

          <!-- Mensajes de estado -->
          <div class="status-messages">
            <div class="success-message" *ngIf="successMessage" [class.show]="successMessage">
              <span class="success-icon">✓</span>
              {{ successMessage }}
            </div>
            
            <div class="error-message" *ngIf="errorMessage" [class.show]="errorMessage">
              <span class="error-icon">✗</span>
              {{ errorMessage }}
            </div>
          </div>

          <!-- Enlace para volver -->
          <div class="back-link">
            <a routerLink="/home" class="back-button">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .password-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f7fbf7;
    }

    .password-content {
      flex: 1;
      overflow-y: auto;
    }

    /* Contenedor principal */
    .password-container {
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100%;
      max-width: 480px;
      margin: 0 auto;
      position: relative;
    }

    .password-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 200%;
      height: 300px;
      background: radial-gradient(circle at center, rgba(79, 157, 96, 0.05) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
    }

    .password-container > * {
      position: relative;
      z-index: 1;
    }

    /* Logo moderno con animación */
    .logo-wrapper {
      margin: 24px auto 36px auto;
      padding: 20px;
      background: linear-gradient(145deg, #ffffff 0%, #f8fdf9 100%);
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      border: 2px solid rgba(79, 157, 96, 0.1);
      animation: fadeInScale 0.6s ease-out;
      transition: all 0.3s ease;
    }

    .logo-wrapper:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 40px rgba(79, 157, 96, 0.15);
    }

    .app-logo {
      width: 90px;
      height: 90px;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(79, 157, 96, 0.2));
      animation: float 3s ease-in-out infinite;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }

    /* Mensaje de bienvenida elegante */
    .welcome-message {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #555;
      margin: 20px 0 12px 0;
      letter-spacing: 0.3px;
      animation: fadeInUp 0.6s ease-out 0.15s backwards;
    }

    .app-name {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 800;
      letter-spacing: 0.5px;
      position: relative;
      display: inline-block;
    }

    /* Título con gradiente moderno */
    .title {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, #2c5f3d 0%, #4f9d60 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;
      margin-bottom: 48px;
      letter-spacing: -0.5px;
      line-height: 1.2;
      animation: fadeInUp 0.6s ease-out 0.1s backwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Form */
    .password-form {
      width: 100%;
    }

    /* Inputs modernos con mejor legibilidad */
    .input-list {
      width: 100%;
      margin-bottom: 30px;
      background: transparent;
      animation: fadeInUp 0.6s ease-out 0.2s backwards;
    }

    .input-item {
      background: white;
      border-radius: 14px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      border: 2px solid rgba(79, 157, 96, 0.08);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      padding: 16px 18px;
      min-height: 60px;
    }

    .input-item.item-has-focus {
      border-color: #4f9d60;
      box-shadow: 0 0 0 4px rgba(79, 157, 96, 0.1), 0 6px 20px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .form-input {
      border: none;
      outline: none;
      font-size: 17px;
      font-weight: 500;
      color: #333;
      background: transparent;
      letter-spacing: 0.2px;
      margin-bottom: 8px;
    }

    .form-input::placeholder {
      color: #777;
      opacity: 0.7;
    }

    /* Requisitos de contraseña */
    .password-requirements {
      margin-top: 12px;
      padding: 12px;
      background: rgba(79, 157, 96, 0.03);
      border-radius: 8px;
      border-left: 3px solid rgba(79, 157, 96, 0.2);
    }

    .requirement {
      font-size: 13px;
      color: #999;
      margin: 4px 0;
      transition: all 0.3s ease;
    }

    .requirement.valid {
      color: #4f9d60;
      font-weight: 600;
    }

    .requirement.valid::before {
      content: '✓ ';
    }

    /* Mensajes de error */
    .error-message {
      font-size: 13px;
      color: #ff4444;
      margin-top: 6px;
      font-weight: 500;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Botón principal premium */
    .main-button {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border: none;
      border-radius: 14px;
      height: 58px;
      font-weight: 800;
      font-size: 19px;
      letter-spacing: 0.5px;
      margin-top: 12px;
      margin-bottom: 32px;
      box-shadow: 0 6px 24px rgba(79, 157, 96, 0.15);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.6s ease-out 0.3s backwards;
      color: white;
      width: 100%;
      cursor: pointer;
    }

    .main-button:not(:disabled):hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 28px rgba(79, 157, 96, 0.3);
    }

    .main-button:not(:disabled):active {
      transform: translateY(-1px);
    }

    .main-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .main-button.loading {
      opacity: 0.8;
    }

    .loading-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .loading-dots {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Mensajes de estado */
    .status-messages {
      width: 100%;
      margin-bottom: 24px;
    }

    .success-message, .error-message {
      padding: 16px 20px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 12px;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }

    .success-message.show, .error-message.show {
      opacity: 1;
      transform: translateY(0);
    }

    .success-message {
      background: rgba(76, 175, 80, 0.1);
      color: #2e7d32;
      border: 1px solid rgba(76, 175, 80, 0.2);
    }

    .error-message {
      background: rgba(244, 67, 54, 0.1);
      color: #d32f2f;
      border: 1px solid rgba(244, 67, 54, 0.2);
    }

    .success-icon, .error-icon {
      font-size: 20px;
      font-weight: bold;
    }

    /* Enlace para volver */
    .back-link {
      width: 100%;
      text-align: center;
      margin-top: 28px;
      animation: fadeInUp 0.6s ease-out 0.6s backwards;
    }

    .back-button {
      color: #4f9d60;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.3px;
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      padding: 12px 20px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .back-button:hover {
      color: #3a7547;
      background: rgba(79, 157, 96, 0.05);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }

    .back-button:active {
      transform: translateY(0);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .password-container {
        padding: 24px 20px;
      }

      .app-logo {
        width: 70px;
        height: 70px;
      }

      .title {
        font-size: 28px;
        margin-bottom: 36px;
      }

      .welcome-message {
        font-size: 16px;
      }

      .input-item {
        padding: 14px 16px;
        min-height: 56px;
      }

      .main-button {
        height: 52px;
        font-size: 17px;
      }
    }

    @media (max-width: 480px) {
      .password-container {
        padding: 20px 16px;
      }

      .logo-wrapper {
        padding: 16px;
        margin: 16px auto 24px auto;
      }

      .app-logo {
        width: 60px;
        height: 60px;
      }

      .title {
        font-size: 24px;
        margin-bottom: 28px;
      }

      .welcome-message {
        font-size: 15px;
        margin: 16px 0 8px 0;
      }

      .input-list {
        margin-bottom: 24px;
      }

      .input-item {
        margin-bottom: 20px;
        min-height: 54px;
      }

      .main-button {
        height: 48px;
        font-size: 16px;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .app-logo {
        animation: none;
      }
    }
  `]
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  currentPasswordFocused = false;
  newPasswordFocused = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService
  ) {
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

  // Métodos para validar los requisitos de la contraseña
  hasMinLength(): boolean {
    const value = this.form.get('newPassword')?.value;
    return value && value.length >= 6;
  }

  hasUpperCase(): boolean {
    const value = this.form.get('newPassword')?.value;
    return value && /[A-Z]/.test(value);
  }

  hasLowerCase(): boolean {
    const value = this.form.get('newPassword')?.value;
    return value && /[a-z]/.test(value);
  }

  hasNumber(): boolean {
    const value = this.form.get('newPassword')?.value;
    return value && /\d/.test(value);
  }

  async changePassword() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const { currentPassword, newPassword } = this.form.value;

    try {
      await this.authService.changePassword(currentPassword, newPassword);
      this.successMessage = '¡Contraseña actualizada correctamente!';
      this.form.reset();
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'La contraseña actual es incorrecta.';
      } else if (error.code === 'auth/weak-password') {
        this.errorMessage = 'La nueva contraseña es demasiado débil. Usa una combinación más segura.';
      } else if (error.code === 'auth/requires-recent-login') {
        this.errorMessage = 'Por seguridad, debes iniciar sesión nuevamente para cambiar la contraseña.';
      } else {
        this.errorMessage = 'Error al actualizar la contraseña. Intenta nuevamente.';
      }
    }

    this.loading = false;
  }
}
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="forgot-app">
      <!-- Content -->
      <main class="forgot-content">
        <div class="forgot-container">
          <!-- Contenedor del Logo (Manzana) -->
          <div class="logo-wrapper">
            <img src="https://i.ibb.co/nq7Zh7HQ/manzana.png" class="app-logo" alt="manzana" border="0">
          </div>

          <!-- Mensaje de Bienvenida -->
          <div class="welcome-message">
            Recupera tu acceso a <span class="app-name">FitIaApp</span>
          </div>

          <!-- Título Principal -->
          <h1 class="title">Recuperar Contraseña</h1>

          <!-- Instrucciones -->
          <div class="instructions">
            Te enviaremos un enlace a tu correo electrónico para restablecer tu contraseña.
          </div>

          <!-- Formulario -->
          <form class="forgot-form" [formGroup]="form" (ngSubmit)="sendReset()">
            <!-- Campo de Email -->
            <div class="input-item" [class.item-has-focus]="emailFocused">
              <input 
                type="email" 
                formControlName="email"
                placeholder="Correo electrónico"
                class="form-input"
                (focus)="emailFocused = true"
                (blur)="emailFocused = false"
                required
              >
              <div class="error-message" *ngIf="form.get('email')?.touched && form.get('email')?.hasError('required')">
                El correo electrónico es obligatorio
              </div>
              <div class="error-message" *ngIf="form.get('email')?.touched && form.get('email')?.hasError('email')">
                Ingresa un correo electrónico válido
              </div>
            </div>

            <!-- Botón Principal -->
            <button 
              type="submit" 
              class="main-button" 
              [disabled]="form.invalid || loading"
              [class.loading]="loading"
            >
              <span class="button-text" *ngIf="!loading">Enviar Enlace de Recuperación</span>
              <span class="loading-text" *ngIf="loading">
                <span class="loading-dots"></span>
                Enviando...
              </span>
            </button>
          </form>

          <!-- Mensajes de estado -->
          <div class="status-messages">
            <div class="success-message" *ngIf="successMessage" [class.show]="successMessage">
              <span class="success-icon">✓</span>
              <div class="message-content">
                {{ successMessage }}
                <div class="message-detail" *ngIf="successMessage">
                  Revisa tu bandeja de entrada y sigue las instrucciones del correo.
                </div>
              </div>
            </div>
            
            <div class="error-message" *ngIf="errorMessage" [class.show]="errorMessage">
              <span class="error-icon">✗</span>
              {{ errorMessage }}
            </div>
          </div>

          <!-- Enlaces adicionales -->
          <div class="additional-links">
            <a routerLink="/login" class="back-link">
              ← Volver al inicio de sesión
            </a>
            <div class="separator">•</div>
            <a routerLink="/register" class="register-link">
              ¿No tienes cuenta? Regístrate
            </a>
          </div>

          <!-- Información adicional -->
          <div class="additional-info">
            <div class="info-icon">💡</div>
            <div class="info-text">
              Si no recibes el correo, revisa tu carpeta de spam o solicita uno nuevo en unos minutos.
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .forgot-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f7fbf7;
    }

    .forgot-content {
      flex: 1;
      overflow-y: auto;
    }

    /* Contenedor principal */
    .forgot-container {
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100%;
      max-width: 480px;
      margin: 0 auto;
      position: relative;
    }

    .forgot-container::before {
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

    .forgot-container > * {
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
      margin-bottom: 24px;
      letter-spacing: -0.5px;
      line-height: 1.2;
      animation: fadeInUp 0.6s ease-out 0.1s backwards;
    }

    /* Instrucciones */
    .instructions {
      text-align: center;
      font-size: 15px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 36px;
      padding: 0 16px;
      animation: fadeInUp 0.6s ease-out 0.2s backwards;
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
    .forgot-form {
      width: 100%;
      animation: fadeInUp 0.6s ease-out 0.3s backwards;
    }

    /* Inputs modernos */
    .input-item {
      background: white;
      border-radius: 14px;
      margin-bottom: 30px;
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
      padding: 20px;
      border-radius: 14px;
      font-weight: 600;
      font-size: 15px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      opacity: 0;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      line-height: 1.4;
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
      font-size: 22px;
      font-weight: bold;
      margin-top: 2px;
    }

    .message-content {
      flex: 1;
    }

    .message-detail {
      font-size: 13px;
      font-weight: 500;
      color: #555;
      margin-top: 6px;
      opacity: 0.9;
    }

    /* Enlaces adicionales */
    .additional-links {
      width: 100%;
      text-align: center;
      margin: 28px 0;
      animation: fadeInUp 0.6s ease-out 0.5s backwards;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .back-link, .register-link {
      color: #4f9d60;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.3px;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      padding: 14px 24px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .back-link:hover, .register-link:hover {
      color: #3a7547;
      background: rgba(79, 157, 96, 0.05);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    }

    .back-link:active, .register-link:active {
      transform: translateY(0);
    }

    .separator {
      color: #999;
      font-size: 18px;
      font-weight: bold;
    }

    /* Información adicional */
    .additional-info {
      background: linear-gradient(135deg, rgba(121, 197, 239, 0.1) 0%, rgba(79, 157, 96, 0.05) 100%);
      border-radius: 14px;
      padding: 18px;
      margin-top: 24px;
      border: 1px solid rgba(121, 197, 239, 0.2);
      animation: fadeInUp 0.6s ease-out 0.6s backwards;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .info-icon {
      font-size: 20px;
      color: #4f9d60;
      margin-top: 2px;
    }

    .info-text {
      flex: 1;
      font-size: 14px;
      color: #555;
      line-height: 1.5;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .forgot-container {
        padding: 24px 20px;
      }

      .app-logo {
        width: 70px;
        height: 70px;
      }

      .title {
        font-size: 28px;
        margin-bottom: 20px;
      }

      .welcome-message {
        font-size: 16px;
      }

      .instructions {
        font-size: 14px;
        margin-bottom: 28px;
      }

      .input-item {
        padding: 14px 16px;
        min-height: 56px;
      }

      .main-button {
        height: 52px;
        font-size: 17px;
      }

      .back-link, .register-link {
        padding: 12px 20px;
        font-size: 15px;
      }
    }

    @media (max-width: 480px) {
      .forgot-container {
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
      }

      .welcome-message {
        font-size: 15px;
        margin: 16px 0 8px 0;
      }

      .instructions {
        font-size: 13px;
        margin-bottom: 24px;
      }

      .input-item {
        margin-bottom: 24px;
        min-height: 54px;
      }

      .main-button {
        height: 48px;
        font-size: 16px;
      }

      .additional-links {
        margin: 24px 0;
      }

      .additional-info {
        padding: 16px;
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
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  emailFocused = false;

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
      this.successMessage = '¡Enlace de recuperación enviado!';
      this.form.reset();
    } catch (error: any) {
      console.error(error);

      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No existe una cuenta con este correo electrónico.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El correo electrónico no es válido.';
      } else if (error.code === 'auth/too-many-requests') {
        this.errorMessage = 'Demasiados intentos. Por favor, espera unos minutos.';
      } else {
        this.errorMessage = 'Error al enviar el enlace de recuperación. Intenta nuevamente.';
      }
    }

    this.loading = false;
  }
}
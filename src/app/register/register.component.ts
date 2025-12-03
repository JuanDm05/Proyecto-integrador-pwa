import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../services/userData.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  template: `
    <div class="register-app">
      <!-- Content -->
      <main class="register-content">
        <div class="register-container">
          <!-- Contenedor del Logo (Manzana) -->
          <div class="logo-wrapper">
            <img src="https://i.ibb.co/nq7Zh7HQ/manzana.png" class="app-logo" alt="manzana" border="0">
          </div>

          <!-- Mensaje de Bienvenida -->
          <div class="welcome-message">
            Únete a <span class="app-name">FitIaApp</span>
          </div>

          <!-- Título Principal -->
          <h1 class="title">Crear Cuenta</h1>

          <!-- Formulario de Registro -->
          <form class="register-form" (ngSubmit)="onSubmit()">
            <!-- Lista de Inputs -->
            <div class="input-list">
              <div class="input-item" [class.item-has-focus]="emailFocused">
                <input 
                  type="email" 
                  [(ngModel)]="email" 
                  name="email"
                  placeholder="Correo electrónico"
                  class="form-input"
                  (focus)="emailFocused = true"
                  (blur)="emailFocused = false"
                  required
                >
              </div>
              
              <div class="input-item" [class.item-has-focus]="passwordFocused">
                <input 
                  type="password" 
                  [(ngModel)]="password" 
                  name="password"
                  placeholder="Contraseña (mínimo 6 caracteres)"
                  class="form-input"
                  (focus)="passwordFocused = true"
                  (blur)="passwordFocused = false"
                  required
                >
                <div class="password-requirements">
                  <div class="requirement" [class.valid]="password.length >= 6">
                    • Mínimo 6 caracteres
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón Principal "Registrarse" -->
            <button type="submit" class="main-register-button" [disabled]="!email || !password || password.length < 6 || loading">
              <span class="button-text" *ngIf="!loading">Crear Cuenta</span>
              <span class="loading-text" *ngIf="loading">
                <span class="loading-dots"></span>
                Creando cuenta...
              </span>
            </button>
          </form>

          <!-- Separador -->
          <div class="separator-text">
            o registrarse con
          </div>

          <!-- Botón de Google (Secundario) -->
          <button class="google-button" (click)="registerWithGoogle()" [disabled]="loading">
            <span class="google-icon">
              <img src="https://i.ibb.co/vCGQWrPF/cromo.png" alt="Google Logo" class="google-logo">
            </span>
            <span class="button-text">Registrarse con Google</span>
          </button>

          <!-- Términos y Condiciones -->
          <div class="terms">
            Al registrarte, aceptas nuestros 
            <a href="#" class="terms-link">Términos de Servicio</a> y 
            <a href="#" class="terms-link">Política de Privacidad</a>
          </div>

          <!-- Mensaje de error -->
          <div class="error-message" *ngIf="error">
            <span class="error-icon">✗</span>
            {{ error }}
          </div>

          <!-- Enlace para iniciar sesión -->
          <div class="login-link">
            ¿Ya tienes una cuenta? 
            <a routerLink="/login" class="login-button">Iniciar Sesión</a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .register-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f7fbf7;
    }

    .register-content {
      flex: 1;
      overflow-y: auto;
    }

    /* Contenedor principal */
    .register-container {
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100%;
      max-width: 480px;
      margin: 0 auto;
      position: relative;
    }

    .register-container::before {
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

    .register-container > * {
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
    .register-form {
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
      margin-bottom: 18px;
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

    .input-item:hover:not(.item-has-focus) {
      border-color: rgba(79, 157, 96, 0.15);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
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
      margin-top: 8px;
    }

    .requirement {
      font-size: 13px;
      color: #999;
      margin: 2px 0;
      transition: all 0.3s ease;
    }

    .requirement.valid {
      color: #4f9d60;
      font-weight: 600;
    }

    .requirement.valid::before {
      content: '✓ ';
    }

    /* Botón principal premium */
    .main-register-button {
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

    .main-register-button:not(:disabled):hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 28px rgba(79, 157, 96, 0.3);
    }

    .main-register-button:not(:disabled):active {
      transform: translateY(-1px);
    }

    .main-register-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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

    /* Separador moderno */
    .separator-text {
      color: #555;
      font-size: 15px;
      font-weight: 600;
      text-align: center;
      margin: 16px 0;
      position: relative;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      animation: fadeInUp 0.6s ease-out 0.4s backwards;
    }

    .separator-text::before,
    .separator-text::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 35%;
      height: 2px;
      background: linear-gradient(to right, transparent, rgba(0,0,0,0.1) 50%, transparent);
    }

    .separator-text::before {
      left: 0;
    }

    .separator-text::after {
      right: 0;
    }

    /* Botón Google mejorado */
    .google-button {
      background: white;
      color: #333;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 14px;
      height: 58px;
      font-size: 17px;
      font-weight: 700;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      letter-spacing: 0.3px;
      animation: fadeInUp 0.6s ease-out 0.5s backwards;
      position: relative;
      overflow: hidden;
      width: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 32px;
    }

    .google-button:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      border-color: rgba(79, 157, 96, 0.3);
    }

    .google-button:active:not(:disabled) {
      transform: translateY(-1px);
    }

    .google-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .google-logo {
      width: 20px;
      height: 20px;
      object-fit: contain;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }

    /* Términos y condiciones */
    .terms {
      text-align: center;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 24px;
      padding: 0 20px;
      animation: fadeInUp 0.6s ease-out 0.6s backwards;
    }

    .terms-link {
      color: #4f9d60;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .terms-link:hover {
      color: #3a7547;
      text-decoration: underline;
    }

    /* Mensaje de error */
    .error-message {
      background: rgba(244, 67, 54, 0.1);
      color: #d32f2f;
      border: 1px solid rgba(244, 67, 54, 0.2);
      border-radius: 12px;
      padding: 16px 20px;
      font-weight: 600;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .error-icon {
      font-size: 20px;
      font-weight: bold;
    }

    /* Enlace para iniciar sesión */
    .login-link {
      width: 100%;
      text-align: center;
      font-size: 15px;
      color: #555;
      animation: fadeInUp 0.6s ease-out 0.7s backwards;
    }

    .login-button {
      color: #4f9d60;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.3px;
      position: relative;
      display: inline-block;
      transition: all 0.3s ease;
      padding: 8px 16px;
      border-radius: 8px;
      margin-left: 4px;
    }

    .login-button:hover {
      color: #3a7547;
      background: rgba(79, 157, 96, 0.05);
    }

    .login-button:active {
      transform: scale(0.98);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .register-container {
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

      .main-register-button,
      .google-button {
        height: 52px;
        font-size: 17px;
      }
    }

    @media (max-width: 480px) {
      .register-container {
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
        margin-bottom: 16px;
        min-height: 54px;
      }

      .main-register-button,
      .google-button {
        height: 48px;
        font-size: 16px;
      }

      .terms {
        font-size: 12px;
        padding: 0 16px;
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
export class RegisterComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  emailFocused = false;
  passwordFocused = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private userDataService: UserDataService
  ) {}

  async onSubmit() {
    this.error = '';
    this.loading = true;

    try {
      const result = await this.authService.register(this.email, this.password);
      console.log('Registro correcto');

      // Crear estructura de datos del usuario
      const uid = result.user?.uid;
      if (uid) {
        await this.userDataService.createUserDataStructure(uid);
      }

      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      console.error(err);
      this.error = this.getErrorMessage(err.code);
    } finally {
      this.loading = false;
    }
  }

  async registerWithGoogle() {
    this.error = '';
    this.loading = true;

    try {
      const result = await this.authService.loginGoogle();
      console.log('Registro con Google exitoso');

      // Crear estructura de datos del usuario
      const uid = result.user?.uid;
      if (uid) {
        await this.userDataService.createUserDataStructure(uid);
      }

      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      console.error(err);
      this.error = this.getErrorMessage(err.code);
    } finally {
      this.loading = false;
    }
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/operation-not-allowed':
        return 'El registro por correo/contraseña no está habilitado.';
      case 'auth/popup-closed-by-user':
        return 'La ventana de Google fue cerrada antes de completar el registro.';
      case 'auth/account-exists-with-different-credential':
        return 'Ya existe una cuenta con este correo usando otro método de inicio de sesión.';
      default:
        return 'Error al registrarse. Por favor, intenta nuevamente.';
    }
  }
}
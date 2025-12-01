import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/userData.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-app">
      <!-- Content -->
      <main class="login-content">
        <div class="login-container">
          <!-- Contenedor del Logo (Manzana) -->
          <div class="logo-wrapper">
       <img src="https://i.ibb.co/nq7Zh7HQ/manzana.png" class="app-logo" alt="manzana" border="0">
          </div>

          <!-- Mensaje de Bienvenida -->
          <div class="welcome-message">
            Bienvenido a <span class="app-name">FitIaApp</span>
          </div>

          <!-- Título Principal -->
          <h1 class="title">Iniciar Sesión</h1>

          <!-- Formulario de Login -->
          <form class="login-form" (ngSubmit)="login()">
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
                  placeholder="Contraseña"
                  class="form-input"
                  (focus)="passwordFocused = true"
                  (blur)="passwordFocused = false"
                  required
                >
              </div>
            </div>

            <!-- Botón Principal "Entrar" -->
            <button type="submit" class="main-login-button" [disabled]="!email || !password">
              <span class="button-text">Entrar</span>
            </button>
          </form>

          <!-- Separador -->
          <div class="separator-text">
            o continuar con
          </div>

          <!-- Botón de Google (Secundario) -->
        <button class="google-button" (click)="loginWithGoogle()">
  <span class="google-icon">
    <img src="https://i.ibb.co/vCGQWrPF/cromo.png" alt="Google Logo" class="google-logo">
  </span>
  <span class="button-text">Acceder con Google</span>
</button>


          <!-- Enlace "¿Olvidaste tu contraseña?" -->
          <div class="forgot-password-link">
            <a routerLink="/olvide-password" (click)="forgotPassword($event)">¿Olvidaste tu contraseña?</a>
            <a routerLink="/register" (click)="register($event)">Registrarse</a>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .login-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f7fbf7;
    }
    /* Estilos para el logo de Google */
.google-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

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
}

.google-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* Versión mejorada con más espacio entre icono y texto */
.google-button {
  padding: 0 24px;
}

/* Para mantener la alineación vertical perfecta */
.google-button .button-text {
  line-height: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .google-button {
    height: 52px;
    font-size: 17px;
    gap: 10px;
  }
  
  .google-logo {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .google-button {
    height: 48px;
    font-size: 16px;
    gap: 8px;
  }
  
  .google-logo {
    width: 16px;
    height: 16px;
  }
}

    .login-content {
      flex: 1;
      overflow-y: auto;
    }

    /* Contenedor principal con diseño mejorado */
    .login-container {
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100%;
      max-width: 480px;
      margin: 0 auto;
      position: relative;
    }

    .login-container::before {
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

    .login-container > * {
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
    .login-form {
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
      align-items: center;
      padding: 14px 18px;
      min-height: 54px;
    }

    .input-item.item-has-focus {
      border-color: #4f9d60;
      box-shadow: 0 0 0 4px rgba(79, 157, 96, 0.1), 0 6px 20px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .input-item.item-has-focus .input-icon {
      transform: scale(1.1);
      color: #3a7547;
    }

    .input-item:hover:not(.item-has-focus) {
      border-color: rgba(79, 157, 96, 0.15);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    }

    .input-icon {
      color: #4f9d60;
      font-size: 20px;
      margin-right: 14px;
      filter: drop-shadow(0 2px 4px rgba(79, 157, 96, 0.1));
      transition: all 0.3s ease;
    }

    .form-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 17px;
      font-weight: 500;
      color: #333;
      background: transparent;
      letter-spacing: 0.2px;
    }

    .form-input::placeholder {
      color: #777;
      opacity: 0.7;
    }

    /* Botón principal premium */
    .main-login-button {
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

    .main-login-button:not(:disabled):hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 28px rgba(79, 157, 96, 0.3);
    }

    .main-login-button:not(:disabled):active {
      transform: translateY(-1px);
    }

    .main-login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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
    }

    .google-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
      border-color: rgba(79, 157, 96, 0.3);
    }

    .google-button:active {
      transform: translateY(-1px);
    }

    .google-icon {
      font-size: 20px;
    }

    .button-text {
      font-weight: 700;
    }

    /* Link mejorado con mejor legibilidad */
    .forgot-password-link {
      width: 100%;
      text-align: center;
      margin-top: 28px;
      animation: fadeInUp 0.6s ease-out 0.6s backwards;
    }

    .forgot-password-link a {
      color: #4f9d60;
      text-decoration: none;
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.3px;
      position: relative;
      display: inline-block;
      transition: all 0.3s ease;
      padding: 8px 12px;
      border-radius: 8px;
    }

    .forgot-password-link a:hover {
      color: #3a7547;
      background: rgba(79, 157, 96, 0.05);
    }

    .forgot-password-link a:active {
      transform: scale(0.98);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .login-container {
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
        padding: 12px 16px;
        min-height: 50px;
      }

      .main-login-button,
      .google-button {
        height: 52px;
        font-size: 17px;
      }
    }

    @media (max-width: 480px) {
      .login-container {
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
        min-height: 48px;
      }

      .main-login-button,
      .google-button {
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
export class LoginComponent {
  email = '';
  password = '';
  emailFocused = false;
  passwordFocused = false;

  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private userDataService: UserDataService   
  ) {}

  /**
   * Intenta iniciar sesión con el correo/usuario y la contraseña.
   */
login() {
  this.errorMessage = '';

  this.authService.login(this.email, this.password)
    .then(async (result) => {
      console.log('Login correctamente');

      const uid = result.user?.uid;
      await this.userDataService.createUserDataStructure(uid);

      this.router.navigateByUrl('/home', { replaceUrl: true });
    })
    .catch((err) => {
      console.error(err);
      this.errorMessage = this.getFirebaseError(err.code);
    });
}


  /**
   * Maneja el inicio de sesión a través de la cuenta de Google.
   */
loginWithGoogle() {
  this.errorMessage = '';

  this.authService.loginGoogle()
    .then(async (result) => {
      console.log('Login con Google exitoso');

      const uid = result.user?.uid;
      await this.userDataService.createUserDataStructure(uid);

      this.router.navigateByUrl('/home', { replaceUrl: true });
    })
    .catch((err) => {
      console.error(err);
      this.errorMessage = this.getFirebaseError(err.code);
    });
}


    getFirebaseError(code: string): string {
    switch (code) {
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/invalid-credential':
        return 'Correo o contraseña incorrectos.';
      case 'auth/popup-closed-by-user':
        return 'La ventana de Google fue cerrada.';
      default:
        return 'Error al iniciar sesión. Intenta nuevamente.';
    }
  }

  /**
   * Navega a la página de recuperación de contraseña.
   */
  forgotPassword(event: Event) {
    event.preventDefault();
    console.log('Enlace para ¿Olvidaste tu contraseña? pulsado.');
    // this.router.navigateByUrl('/forgot-password');
  }
    register(event: Event) {
    event.preventDefault();
    console.log('Enlace para register pulsado.');
  }
}
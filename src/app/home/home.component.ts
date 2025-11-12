import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-app">
      <!-- Header -->
      <header class="home-header">
        <div class="header-content">
          <h1 class="title">
            <span class="header-icon">🏠</span>
            Inicio
          </h1>
          <button class="menu-button" (click)="presentMenu($event)">
            <img src="assets/menu.png" alt="Menú" class="menu-icon">
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="home-content">
        <!-- Wrapper principal para el centrado del contenido -->
        <div class="main-content-wrapper">
          <!-- Contenedor de Bienvenida -->
          <div class="welcome-card">
            <div class="welcome-icon">😊</div>
            <h2 class="welcome-title">Bienvenido, Atleta 💪</h2>
            <p class="welcome-text">Habla con tu Coach IA o revisa tus planes de entrenamiento y nutrición.</p>
          </div>
          
          <div class="button-group">
            <!-- Botón Abrir Chat (Principal, Verde de Acento) -->
            <button class="chat-button" routerLink="/chat">
              <span class="button-icon">💬</span>
              Abrir Chat
            </button>
            
            <!-- Botón Ver Rutinas -->
            <button class="secondary-button" routerLink="/routines">
              <span class="button-icon">🏋️</span>
              Ver Rutinas
            </button>
            
            <!-- Botón Ver Dietas -->
            <button class="secondary-button" routerLink="/diet">
              <span class="button-icon">🥗</span>
              Ver Dietas
            </button>
          </div>

          <!-- Imagen de entrenamiento funcional -->
          <div class="training-image-container">
    <img src="assets/entrenamientoFuncional2.png" alt="Entrenamiento Funcional" class="training-image">
          </div>
        </div>
      </main>

      <!-- Menu Popover -->
      <div *ngIf="showMenu" class="menu-popover-overlay" (click)="closeMenu()">
        <div class="menu-popover" (click)="$event.stopPropagation()">
          <div class="menu-list">
            <button class="menu-item" (click)="logout()">
              <span class="menu-icon">🚪</span>
              <span class="menu-label">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Logout Confirmation -->
      <div *ngIf="showLogoutConfirm" class="alert-overlay" (click)="closeLogoutConfirm()">
        <div class="alert-dialog" (click)="$event.stopPropagation()">
          <div class="alert-header">
            <h3>Cerrar Sesión</h3>
          </div>
          <div class="alert-content">
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
          </div>
          <div class="alert-actions">
            <button class="alert-button secondary" (click)="closeLogoutConfirm()">
              Cancelar
            </button>
            <button class="alert-button danger" (click)="confirmLogout()">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f7fbf7;
    }

    /* Header */
    .home-header {
      background: #4f9d60;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .title {
      color: white;
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-icon {
      font-size: 20px;
    }

    .menu-button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .menu-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .menu-icon {
      width: 24px;
      height: 24px;
      filter: brightness(0) invert(1);
    }

    /* Content */
    .home-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .main-content-wrapper {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
    }

    /* Welcome Card */
    .welcome-card {
      width: 100%;
      background: white;
      border-radius: 20px;
      padding: 32px 24px;
      margin-bottom: 32px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      max-width: 500px;
    }

    .welcome-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    }

    .welcome-icon {
      font-size: 48px;
      margin-bottom: 12px;
      animation: pulse 2s ease-in-out infinite;
    }

    .welcome-title {
      font-size: 24px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
      text-align: center;
      line-height: 1.3;
    }

    .welcome-text {
      font-size: 16px;
      color: #666;
      text-align: center;
      line-height: 1.6;
      margin: 0;
    }

    /* Button Group */
    .button-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 500px;
      margin-bottom: 32px;
    }

    /* Chat Button */
    .chat-button {
      background: #4f9d60;
      color: white;
      border: none;
      border-radius: 12px;
      padding: 16px 24px;
      font-weight: bold;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(79, 157, 96, 0.3);
    }

    .chat-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(79, 157, 96, 0.4);
      background: #3a7547;
    }

    .chat-button:active {
      transform: translateY(-1px);
    }

    /* Secondary Buttons */
    .secondary-button {
      background: white;
      color: #333;
      border: 1.5px solid #e0e0e0;
      border-radius: 12px;
      padding: 16px 24px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .secondary-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      border-color: #4f9d60;
    }

    .secondary-button:active {
      transform: translateY(-1px);
    }

    .button-icon {
      font-size: 20px;
    }

    /* Training Image */
    .training-image-container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 500px;
    }

    .training-image {
      width: 100%;
      height: auto;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .training-image:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
    }

    /* Menu Popover */
    .menu-popover-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      padding: 60px 16px 0 0;
      z-index: 1000;
    }

    .menu-popover {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      min-width: 200px;
      overflow: hidden;
    }

    .menu-list {
      padding: 0;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: white;
      border: none;
      width: 100%;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .menu-item:hover {
      background: #f5f5f5;
    }

    .menu-icon {
      font-size: 18px;
    }

    .menu-label {
      color: #d32f2f;
      font-weight: 500;
    }

    /* Alert Dialog */
    .alert-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      padding: 16px;
    }

    .alert-dialog {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 100%;
      overflow: hidden;
    }

    .alert-header {
      padding: 20px 20px 0 20px;
    }

    .alert-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .alert-content {
      padding: 16px 20px;
    }

    .alert-content p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }

    .alert-actions {
      display: flex;
      gap: 12px;
      padding: 16px 20px 20px 20px;
    }

    .alert-button {
      flex: 1;
      padding: 12px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .alert-button.secondary {
      background: #f0f0f0;
      color: #333;
    }

    .alert-button.secondary:hover {
      background: #e0e0e0;
    }

    .alert-button.danger {
      background: #d32f2f;
      color: white;
    }

    .alert-button.danger:hover {
      background: #c62828;
    }

    /* Animations */
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    /* Responsive */
    @media (max-width: 768px) {
      .home-content {
        padding: 12px;
      }

      .welcome-card {
        padding: 24px 16px;
        margin-bottom: 24px;
      }

      .welcome-title {
        font-size: 20px;
      }

      .welcome-text {
        font-size: 14px;
      }

      .button-group {
        gap: 12px;
        margin-bottom: 24px;
      }

      .chat-button,
      .secondary-button {
        padding: 14px 20px;
        font-size: 16px;
      }

      .training-image-container {
        max-width: 400px;
      }
    }

    @media (max-width: 480px) {
      .header-content {
        padding: 8px 12px;
      }

      .title {
        font-size: 16px;
      }

      .welcome-card {
        padding: 20px 16px;
      }

      .welcome-icon {
        font-size: 40px;
      }

      .welcome-title {
        font-size: 18px;
      }

      .chat-button,
      .secondary-button {
        padding: 12px 16px;
        font-size: 14px;
      }

      .training-image-container {
        max-width: 100%;
      }
    }

    @media (max-height: 500px) and (orientation: landscape) {
      .main-content-wrapper {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        gap: 20px;
        min-height: auto;
      }

      .welcome-card {
        margin-bottom: 0;
        max-width: 45%;
        padding: 16px;
      }

      .button-group {
        max-width: 45%;
        gap: 10px;
        margin-bottom: 0;
      }

      .training-image-container {
        display: none;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .welcome-icon {
        animation: none;
      }
    }
  `]
})
export class HomeComponent {
  showMenu = false;
  showLogoutConfirm = false;

  presentMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = true;
  }

  closeMenu() {
    this.showMenu = false;
  }

  logout() {
    this.closeMenu();
    this.showLogoutConfirm = true;
  }

  closeLogoutConfirm() {
    this.showLogoutConfirm = false;
  }

  confirmLogout() {
    // Limpiar datos de sesión
    localStorage.clear();
    sessionStorage.clear();
    
    // Navegar al login
    window.location.href = '/login'; // Usamos window.location para recargar la app
  }
}
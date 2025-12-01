import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
            <img src="https://i.ibb.co/bMyVB1BS/menu-1.png" alt="menu-1" border="0" class="menu-icon">
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="home-content">
        <!-- Wrapper principal para el centrado del contenido -->
        <div class="main-content-wrapper">
          <!-- Contenedor de Bienvenida -->
          <div class="welcome-card">
            <!-- Imagen de funcionamiento con efecto de pulso -->
            <div class="welcome-icon">
              <img src="https://i.ibb.co/zTvCdkzT/funcionamiento.png" 
                   alt="Funcionamiento FitIaApp" 
                   class="welcome-image">
            </div>
            
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

      <!-- Logout Confirmation NATIVO - CENTRADO -->
      <div *ngIf="showLogoutConfirm" class="native-overlay" (click)="closeLogoutConfirm()">
        <div class="native-dialog-container">
          <!-- iOS Style (Cupertino) -->
          <div *ngIf="isIOS" class="native-dialog ios-dialog" (click)="$event.stopPropagation()">
            <div class="dialog-content">
              <div class="ios-header">
                <h3 class="ios-title">Cerrar Sesión</h3>
              </div>
              <div class="ios-content">
                <p>¿Estás seguro de que deseas cerrar sesión?</p>
              </div>
              <div class="ios-actions">
                <button class="ios-button cancel" (click)="closeLogoutConfirm()">
                  Cancelar
                </button>
                <div class="ios-separator"></div>
                <button class="ios-button destructive" (click)="confirmLogout()">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          <!-- Android Style (Material) -->
          <div *ngIf="isAndroid" class="native-dialog android-dialog" (click)="$event.stopPropagation()">
            <div class="dialog-content">
              <div class="android-header">
                <h3 class="android-title">Cerrar Sesión</h3>
              </div>
              <div class="android-content">
                <p>¿Estás seguro de que deseas cerrar sesión?</p>
              </div>
              <div class="android-actions">
                <button class="android-button text-button" (click)="closeLogoutConfirm()">
                  CANCELAR
                </button>
                <button class="android-button text-button destructive" (click)="confirmLogout()">
                  CERRAR SESIÓN
                </button>
              </div>
            </div>
          </div>

          <!-- Fallback para Web/Desktop -->
          <div *ngIf="!isMobile" class="native-dialog web-dialog" (click)="$event.stopPropagation()">
            <div class="dialog-content">
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

    /* Botón de menú con efecto "neumórfico" */
    .menu-button {
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      border: none;
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      width: 52px;
      height: 52px;
      position: relative;
      overflow: hidden;
    }

    .menu-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .menu-button:hover::before {
      left: 100%;
    }

    .menu-button:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 6px 12px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .menu-icon {
      width: 24px;
      height: 24px;
      filter: brightness(0) invert(1);
      transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }

    .menu-button:hover .menu-icon {
      transform: rotate(180deg);
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
      display: flex;
      align-items: center;
      justify-content: center;
      width: 120px;
      height: 120px;
    }

    /* Imagen dentro del welcome-icon */
    .welcome-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 50%;
      box-shadow: 0 4px 20px rgba(79, 157, 96, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .welcome-card:hover .welcome-image {
      transform: scale(1.05);
      box-shadow: 0 6px 25px rgba(79, 157, 96, 0.3);
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

    /* ===== OVERLAY Y DIALOG NATIVOS CENTRADOS ===== */
    
    /* Overlay principal - FIXED y CENTRADO */
    .native-overlay {
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
      padding: 20px;
      animation: fadeIn 0.2s ease-out;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }

    /* Contenedor para centrar el diálogo */
    .native-dialog-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    /* Diálogo base - CENTRADO */
    .native-dialog {
      display: flex;
      align-items: center;
      justify-content: center;
      animation: dialogSlideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      max-width: 100%;
      max-height: 100%;
    }

    .dialog-content {
      width: 100%;
      animation: scaleIn 0.2s ease-out;
    }

    /* ===== iOS STYLE (Cupertino) - CENTRADO ===== */
    .ios-dialog .dialog-content {
      background: #f2f2f7;
      border-radius: 14px;
      overflow: hidden;
      max-width: 270px;
      width: 100%;
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.2),
        0 0 0 0.5px rgba(0, 0, 0, 0.1);
    }

    .ios-header {
      padding: 19px 16px 7px;
      text-align: center;
    }

    .ios-title {
      margin: 0;
      font-size: 17px;
      font-weight: 600;
      color: #000;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      letter-spacing: -0.4px;
    }

    .ios-content {
      padding: 7px 16px 19px;
      text-align: center;
    }

    .ios-content p {
      margin: 0;
      font-size: 13px;
      color: #666;
      line-height: 1.4;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    }

    .ios-actions {
      border-top: 0.5px solid #c6c6c8;
      display: flex;
      flex-direction: column;
    }

    .ios-button {
      background: transparent;
      border: none;
      padding: 16.5px;
      font-size: 17px;
      cursor: pointer;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
      font-weight: 400;
      color: #007aff;
      transition: background-color 0.1s;
      -webkit-tap-highlight-color: transparent;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ios-button.cancel {
      font-weight: 600;
      border-top: 0.5px solid #c6c6c8;
    }

    .ios-button.destructive {
      color: #ff3b30;
    }

    .ios-separator {
      height: 0.5px;
      background: #c6c6c8;
    }

    .ios-button:active {
      background-color: rgba(0, 0, 0, 0.1);
    }

    /* ===== ANDROID STYLE (Material Design) - CENTRADO ===== */
    .android-dialog .dialog-content {
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      max-width: 280px;
      width: 100%;
      box-shadow: 
        0 24px 38px rgba(0, 0, 0, 0.14), 
        0 9px 46px rgba(0, 0, 0, 0.12), 
        0 11px 15px rgba(0, 0, 0, 0.2);
    }

    .android-header {
      padding: 24px 24px 20px;
    }

    .android-title {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      font-family: 'Roboto', 'Segoe UI', sans-serif;
      line-height: 1.4;
    }

    .android-content {
      padding: 0 24px 24px;
    }

    .android-content p {
      margin: 0;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 1.5;
      font-family: 'Roboto', 'Segoe UI', sans-serif;
    }

    .android-actions {
      padding: 8px 16px 16px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .android-button {
      background: transparent;
      border: none;
      padding: 10px 16px;
      font-size: 14px;
      cursor: pointer;
      font-family: 'Roboto', 'Segoe UI', sans-serif;
      font-weight: 500;
      text-transform: uppercase;
      color: #6200ee;
      border-radius: 20px;
      letter-spacing: 0.5px;
      min-height: 36px;
      min-width: 64px;
      transition: all 0.2s;
      -webkit-tap-highlight-color: transparent;
    }

    .android-button.text-button {
      color: #6200ee;
    }

    .android-button.destructive {
      color: #d32f2f;
    }

    .android-button:active {
      background-color: rgba(98, 0, 238, 0.1);
    }

    /* ===== WEB/DESKTOP STYLE - CENTRADO ===== */
    .web-dialog .dialog-content {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      max-width: 400px;
      width: 100%;
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    .alert-header {
      padding: 24px 24px 8px;
      text-align: center;
    }

    .alert-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    .alert-content {
      padding: 16px 24px 24px;
      text-align: center;
    }

    .alert-content p {
      margin: 0;
      font-size: 16px;
      color: #666;
      line-height: 1.5;
    }

    .alert-actions {
      display: flex;
      gap: 12px;
      padding: 16px 24px 24px;
    }

    .alert-button {
      flex: 1;
      padding: 14px 20px;
      border: none;
      border-radius: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 16px;
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

    /* ===== ANIMACIONES ===== */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes dialogSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .home-content {
        padding: 12px;
      }

      .welcome-card {
        padding: 24px 16px;
        margin-bottom: 24px;
      }

      .welcome-icon {
        width: 100px;
        height: 100px;
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

      /* Diálogos en móvil */
      .ios-dialog .dialog-content {
        max-width: 280px;
        border-radius: 13px;
      }
      
      .android-dialog .dialog-content {
        max-width: 300px;
        border-radius: 24px;
      }
      
      .web-dialog .dialog-content {
        max-width: 320px;
        border-radius: 16px;
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
        width: 90px;
        height: 90px;
      }

      .welcome-title {
        font-size: 18px;
      }

      .chat-button,
      .secondary-button {
        padding: 12px 16px;
        font-size: 14px;
      }

      /* Diálogos en pantallas pequeñas */
      .ios-dialog .dialog-content {
        max-width: 260px;
      }
      
      .android-dialog .dialog-content {
        max-width: 280px;
        border-radius: 20px;
      }
      
      .web-dialog .dialog-content {
        max-width: 300px;
        border-radius: 16px;
      }
      
      .native-overlay {
        padding: 16px;
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
      
      .native-overlay {
        padding: 10px;
        align-items: flex-start;
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
      
      .native-overlay,
      .native-dialog,
      .dialog-content {
        animation: none !important;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  showMenu = false;
  showLogoutConfirm = false;
  
  // Variables para detección de plataforma
  isIOS = false;
  isAndroid = false;
  isMobile = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectPlatform();
    }
  }

  detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Detectar iOS
    this.isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    
    // Detectar Android
    this.isAndroid = /android/i.test(userAgent);
    
    // Detectar si es móvil
    this.isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Para testing, puedes forzar una plataforma:
    // this.isIOS = true; // Para ver estilo iOS
    // this.isAndroid = true; // Para ver estilo Android
  }

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
    window.location.href = '/login';
  }
}
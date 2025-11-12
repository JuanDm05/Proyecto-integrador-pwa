import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Servicio temporal integrado
interface Routine {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  isLocal?: boolean;
}

interface TrainingSplit {
  day: string;
  focus: string;
  exercises: string;
}

class TemporaryRoutinesService {
  private routines: Routine[] = [];
  private storageKey = 'routines_data';
  private pendingSync: Routine[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.routines = JSON.parse(stored);
      }
      
      const pending = localStorage.getItem('routines_pending_sync');
      if (pending) {
        this.pendingSync = JSON.parse(pending);
      }
    } catch (e) {
      console.warn('Error loading routines from storage:', e);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.routines));
      localStorage.setItem('routines_pending_sync', JSON.stringify(this.pendingSync));
    } catch (e) {
      console.warn('Error saving routines to storage:', e);
    }
  }

  async getAll(): Promise<Routine[]> {
    return [...this.routines];
  }

  async add(routine: Routine, isOnline: boolean): Promise<void> {
    if (isOnline) {
      this.routines.push(routine);
    } else {
      routine.isLocal = true;
      this.routines.push(routine);
      this.pendingSync.push(routine);
    }
    this.saveToStorage();
  }

  async remove(id: string): Promise<void> {
    this.routines = this.routines.filter(r => r.id !== id);
    this.pendingSync = this.pendingSync.filter(r => r.id !== id);
    this.saveToStorage();
  }

  async syncPendingRoutines(): Promise<void> {
    if (this.pendingSync.length > 0) {
      console.log('Sincronizando rutinas pendientes...', this.pendingSync);
      
      for (const routine of this.pendingSync) {
        console.log('Sincronizando rutina:', routine.title);
        
        const index = this.routines.findIndex(r => r.id === routine.id);
        if (index !== -1) {
          this.routines[index].isLocal = false;
        }
      }
      
      this.pendingSync = [];
      this.saveToStorage();
    }
  }

  getPendingSyncCount(): number {
    return this.pendingSync.length;
  }
}

@Component({
  selector: 'app-routines',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="routines-app">
      <!-- Header -->
      <header class="routines-header">
        <div class="header-content">
          <button class="back-button" routerLink="/home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 class="title">Plan de Entrenamiento</h1>
          
          <!-- Indicador de Estado de Conexión -->
          <div class="connection-status" [class.offline]="!isOnline">
            <div class="status-dot"></div>
            <span class="status-text">
              {{ isOnline ? 'En línea' : 'Sin conexión' }}
            </span>
            <span *ngIf="pendingSyncCount > 0" class="sync-badge">
              {{ pendingSyncCount }}
            </span>
          </div>
        </div>
      </header>

      <!-- Banner Offline -->
      <div *ngIf="!isOnline" class="offline-banner">
        <div class="offline-content">
          <span class="offline-icon">⚡</span>
          <div class="offline-text">
            <strong>Modo sin conexión</strong>
            <span>Trabajando con datos locales. Los cambios se sincronizarán automáticamente.</span>
          </div>
        </div>
      </div>

      <!-- Content -->
      <main class="routines-content">
        <div class="routines-wrapper">
          
          <!-- Header Info -->
          <div class="header-info">
            <div class="barbell-icon">🏋️</div>
            <h1>Plan de Entrenamiento Semanal</h1>
            <p>Split: Empuje, Jalón, Pierna (PPL) + Descanso. ¡Máxima Hipertrofia!</p>
          </div>

          <!-- Lista de Rutinas -->
          <div class="routines-list">
            <div 
              *ngFor="let r of trainingSplit" 
              class="routine-card"
              [class.rest-day]="r.focus.includes('Descanso')">
              
              <!-- Badge del día -->
              <div class="day-badge">
                <div class="calendar-icon">📅</div>
                <span>{{ r.day }}</span>
              </div>
              
              <!-- Contenido de la card -->
              <div class="card-content">
                <!-- Enfoque -->
                <div class="focus-section">
                  <div class="focus-icon">💪</div>
                  <h3>{{ r.focus }}</h3>
                </div>
                
                <!-- Ejercicios -->
                <div class="exercises-section">
                  <div class="exercises-icon">📝</div>
                  <p>{{ r.exercises }}</p>
                </div>
              </div>
              
              <!-- Emoji decorativo para descanso -->
              <div class="rest-emoji" *ngIf="r.focus.includes('Descanso')">
                💤
              </div>
            </div>
          </div>

          <!-- Sección de Rutinas Personalizadas -->
          <h2 class="section-title">Mis Rutinas Personalizadas</h2>

          <!-- Formulario para agregar rutinas -->
          <div class="custom-routine-form">
            <div class="input-group">
              <input 
                type="text" 
                [(ngModel)]="title" 
                name="title"
                placeholder="Nombre de la rutina"
                class="form-input"
              >
              <textarea 
                [(ngModel)]="desc" 
                name="description"
                placeholder="Descripción de la rutina"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
            <button class="add-btn" (click)="add()" [disabled]="!title.trim()">
              <span class="button-icon">➕</span>
              {{ isOnline ? 'Agregar Rutina' : 'Guardar Localmente' }}
            </button>
          </div>

          <!-- Lista de rutinas personalizadas -->
          <div class="custom-routines-list">
            <div *ngFor="let routine of routines" class="routine-item" [class.local-routine]="routine.isLocal">
              <div class="routine-content">
                <div class="routine-header">
                  <h3>{{ routine.title }}</h3>
                  <span *ngIf="routine.isLocal" class="local-badge">Local</span>
                </div>
                <p>{{ routine.description }}</p>
                <div class="routine-date">
                  {{ formatDate(routine.createdAt) }}
                </div>
              </div>
              <button class="delete-btn" (click)="remove(routine.id)">
                <span class="delete-icon">🗑️</span>
              </button>
            </div>

            <!-- Estado vacío -->
            <div *ngIf="routines.length === 0" class="empty-state">
              <div class="empty-icon">📋</div>
              <h3>No hay rutinas personalizadas</h3>
              <p>Crea tu primera rutina personalizada usando el formulario de arriba</p>
              <p *ngIf="!isOnline" class="offline-hint">
                💡 En modo offline, las rutinas se guardan localmente en tu dispositivo.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .routines-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f7fbf7;
      position: relative;
    }

    .routines-app::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 250px;
      background: linear-gradient(180deg, rgba(79, 157, 96, 0.04) 0%, transparent 100%);
      pointer-events: none;
    }

    /* Header */
    .routines-header {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      position: relative;
    }

    .routines-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    }

    .header-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .back-button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      margin-right: 12px;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .title {
      color: white;
      margin: 0;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    /* Connection Status */
    .connection-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: white;
      font-size: 12px;
      font-weight: 600;
      position: relative;
    }

    .connection-status.offline {
      background: rgba(255, 152, 0, 0.3);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4caf50;
      animation: pulse 2s infinite;
    }

    .connection-status.offline .status-dot {
      background: #ff9800;
    }

    .sync-badge {
      background: #ff9800;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
    }

    /* Offline Banner */
    .offline-banner {
      background: linear-gradient(135deg, #ff9800, #f57c00);
      color: white;
      padding: 12px 16px;
    }

    .offline-content {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .offline-icon {
      font-size: 20px;
    }

    .offline-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .offline-text strong {
      font-size: 14px;
    }

    .offline-text span {
      font-size: 12px;
      opacity: 0.9;
    }

    /* Content */
    .routines-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      position: relative;
      z-index: 1;
    }

    .routines-wrapper {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    }

    /* Header Info */
    .header-info {
      text-align: center;
      margin-bottom: 32px;
      padding: 32px 24px;
      background: linear-gradient(145deg, #ffffff 0%, #f8fdf9 100%);
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.6s ease-out;
      border: 1px solid rgba(79, 157, 96, 0.1);
    }

    .header-info::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
    }

    .barbell-icon {
      font-size: 48px;
      margin-bottom: 12px;
      filter: drop-shadow(0 4px 12px rgba(79, 157, 96, 0.25));
      animation: float 3s ease-in-out infinite;
    }

    .header-info h1 {
      font-size: 24px;
      font-weight: 800;
      background: linear-gradient(135deg, #2c5f3d 0%, #4f9d60 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 8px 0;
      line-height: 1.2;
    }

    .header-info p {
      color: #666;
      font-size: 16px;
      margin: 0;
      line-height: 1.6;
      font-weight: 500;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Routines List */
    .routines-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      animation: fadeInUp 0.6s ease-out 0.15s backwards;
    }

    /* Routine Card */
    .routine-card {
      background: linear-gradient(145deg, #ffffff 0%, #f8fdf9 100%);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
      border: 2px solid rgba(79, 157, 96, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .routine-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 5px;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .routine-card:hover:not(.rest-day) {
      transform: translateX(8px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border-color: rgba(79, 157, 96, 0.25);
    }

    .routine-card:hover:not(.rest-day)::before {
      transform: scaleY(1);
    }

    .routine-card.rest-day {
      background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
      border-color: rgba(79, 157, 96, 0.15);
    }

    /* Day Badge */
    .day-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border-radius: 12px;
      color: white;
      font-weight: 800;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 4px 12px rgba(79, 157, 96, 0.15);
      width: fit-content;
      transition: all 0.3s ease;
    }

    .calendar-icon {
      font-size: 18px;
    }

    /* Card Content */
    .card-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Focus Section */
    .focus-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .focus-icon {
      font-size: 28px;
      color: #4f9d60;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 6px rgba(79, 157, 96, 0.2));
    }

    .focus-section h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: #3a7547;
      letter-spacing: 0.3px;
      line-height: 1.3;
    }

    /* Exercises Section */
    .exercises-section {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      background: white;
      border-radius: 12px;
      border: 1px solid rgba(79, 157, 96, 0.08);
    }

    .exercises-icon {
      font-size: 22px;
      color: #6bb77b;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .exercises-section p {
      margin: 0;
      font-size: 15px;
      font-weight: 500;
      color: #555;
      line-height: 1.7;
      letter-spacing: 0.2px;
    }

    /* Rest Emoji */
    .rest-emoji {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 32px;
      opacity: 0.3;
      animation: pulse 2s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.3;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.5;
      }
    }

    /* Section Title */
    .section-title {
      font-size: 24px;
      font-weight: 800;
      background: linear-gradient(135deg, #2c5f3d 0%, #4f9d60 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      padding-bottom: 12px;
      margin-top: 48px;
      margin-bottom: 24px;
      letter-spacing: -0.5px;
      animation: fadeInUp 0.6s ease-out 0.3s backwards;
    }

    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 80px;
      height: 4px;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(79, 157, 96, 0.15);
    }

    /* Custom Routine Form */
    .custom-routine-form {
      background: linear-gradient(145deg, #ffffff 0%, #f8fdf9 100%);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      margin-bottom: 24px;
      border: 1px solid rgba(79, 157, 96, 0.12);
      transition: all 0.3s ease;
    }

    .custom-routine-form:hover {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      transform: translateY(-3px);
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-input, .form-textarea {
      background: white;
      border: 2px solid rgba(79, 157, 96, 0.15);
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: #4f9d60;
      box-shadow: 0 0 0 4px rgba(79, 157, 96, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .add-btn {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border: none;
      border-radius: 10px;
      margin-top: 16px;
      font-weight: 800;
      height: 50px;
      box-shadow: 0 6px 20px rgba(79, 157, 96, 0.15);
      transition: all 0.3s ease;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      font-size: 16px;
    }

    .add-btn:not(:disabled):hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(79, 157, 96, 0.3);
    }

    .add-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    /* Custom Routines List */
    .custom-routines-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .routine-item {
      background: linear-gradient(145deg, #ffffff 0%, #f8fdf9 100%);
      border-radius: 14px;
      padding: 20px;
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(79, 157, 96, 0.12);
      transition: all 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .routine-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }

    .routine-item.local-routine {
      border-left: 4px solid #ff9800 !important;
      position: relative;
    }

    .routine-content {
      flex: 1;
    }

    .routine-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .routine-header h3 {
      margin: 0 !important;
      font-size: 18px;
      font-weight: 700;
      color: #3a7547;
    }

    .local-badge {
      background: #ff9800;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .routine-content p {
      font-size: 15px;
      color: #555;
      line-height: 1.7;
      margin: 0 0 8px 0;
    }

    .routine-date {
      font-size: 12px;
      color: #888;
      font-weight: 500;
    }

    .delete-btn {
      background: #dc3545;
      border: none;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .delete-btn:hover {
      background: #c82333;
      transform: scale(1.1);
    }

    .delete-icon {
      font-size: 16px;
    }

    /* Empty State */
    .empty-state {
      background: linear-gradient(135deg, #f8f8f8, #ffffff);
      border-radius: 14px;
      margin-top: 24px;
      padding: 32px;
      text-align: center;
      border: 2px dashed rgba(79, 157, 96, 0.3);
      color: #777;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.6;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    .offline-hint {
      font-size: 13px !important;
      color: #666 !important;
      margin-top: 8px !important;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .routines-content {
        padding: 12px;
      }

      .header-info {
        padding: 24px 20px;
        margin-bottom: 24px;
      }

      .header-info h1 {
        font-size: 20px;
      }

      .routine-card {
        padding: 16px;
      }

      .section-title {
        font-size: 20px;
        margin-top: 36px;
        margin-bottom: 20px;
      }

      .custom-routine-form {
        padding: 20px;
      }

      .connection-status {
        font-size: 11px;
        padding: 4px 8px;
      }
    }

    @media (max-width: 480px) {
      .header-content {
        padding: 8px 12px;
      }

      .title {
        font-size: 16px;
      }

      .header-info {
        padding: 20px 16px;
      }

      .barbell-icon {
        font-size: 40px;
      }

      .header-info h1 {
        font-size: 18px;
      }

      .routine-card {
        gap: 12px;
      }

      .focus-section h3 {
        font-size: 18px;
      }

      .exercises-section p {
        font-size: 14px;
      }

      .rest-emoji {
        font-size: 24px;
        right: 12px;
        top: 12px;
      }

      .connection-status {
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

      .barbell-icon {
        animation: none;
      }

      .rest-emoji {
        animation: none;
      }

      .status-dot {
        animation: none;
      }
    }
  `]
})
export class RoutinesComponent implements OnInit, OnDestroy {
  title = '';
  desc = '';
  routines: Routine[] = [];
  isOnline: boolean = navigator.onLine;
  pendingSyncCount: number = 0;

  // Datos predefinidos para la tabla PPL
  trainingSplit: TrainingSplit[] = [
    { 
      day: 'Lunes', 
      focus: 'Empuje (Push)', 
      exercises: 'Press Banca (4x10), Press Militar (3x10), Elevaciones Laterales (3x15), Extensión de Tríceps (3x12)'
    },
    { 
      day: 'Martes', 
      focus: 'Jalón (Pull)', 
      exercises: 'Dominadas (4xMax), Remo con Barra (4x10), Curl de Bíceps (3x12), Encogimiento de Hombros (3x15)'
    },
    { 
      day: 'Miércoles', 
      focus: 'Pierna (Legs)', 
      exercises: 'Sentadilla (5x5), Prensa (3x10), Extensión de Cuádriceps (3x12), Peso Muerto Rumano (3x10)'
    },
    { 
      day: 'Jueves', 
      focus: 'Descanso Activo', 
      exercises: '30 minutos de cardio ligero o movilidad. ¡Recuperación esencial!'
    },
    { 
      day: 'Viernes', 
      focus: 'Empuje Ligeros (Push)', 
      exercises: 'Press Inclinado con Mancuernas (3x12), Aperturas (3x15), Elevaciones Frontales (3x12), Patada de Tríceps (3x15)'
    },
    { 
      day: 'Sábado', 
      focus: 'Jalón Ligeros (Pull)', 
      exercises: 'Remo Sentado (3x12), Face Pulls (3x15), Hammer Curl (3x12), Abdominales con peso (3x15)'
    },
    { 
      day: 'Domingo', 
      focus: 'Descanso Total', 
      exercises: 'Día libre. Prioriza el sueño y la hidratación.'
    }
  ];

  private routinesService = new TemporaryRoutinesService();

  async ngOnInit() {
    // Configurar listeners de conexión
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Carga las rutinas personalizadas al iniciar
    await this.loadRoutines();
    this.updatePendingSyncCount();
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.handleOnline.bind(this));
    window.removeEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline() {
    this.isOnline = true;
    console.log('Conexión recuperada - Sincronizando...');
    this.syncPendingRoutines();
  }

  private handleOffline() {
    this.isOnline = false;
    console.log('Sin conexión - Modo offline activado');
  }

  async loadRoutines() {
    this.routines = await this.routinesService.getAll();
  }

  async add() {
    if (!this.title.trim()) return;
    const r: Routine = {
      id: this.generateId(),
      title: this.title,
      description: this.desc,
      createdAt: Date.now()
    };
    await this.routinesService.add(r, this.isOnline);
    this.title = '';
    this.desc = '';
    await this.loadRoutines();
    this.updatePendingSyncCount();
  }

  async remove(id: string) {
    await this.routinesService.remove(id);
    await this.loadRoutines();
    this.updatePendingSyncCount();
  }

  private async syncPendingRoutines() {
    await this.routinesService.syncPendingRoutines();
    await this.loadRoutines();
    this.updatePendingSyncCount();
  }

  private updatePendingSyncCount() {
    this.pendingSyncCount = this.routines.filter(r => r.isLocal).length;
  }

  private generateId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
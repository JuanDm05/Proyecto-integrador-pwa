import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirebaseService } from '../services/diet.service';

export interface Meal {
  desayuno: string;
  comida: string;
  cena: string;
  desayunoDone?: boolean;
  comidaDone?: boolean;
  cenaDone?: boolean;
}

export interface WeeklyMenu {
  day: string;
  meals: Meal;
}

@Component({
  selector: 'app-diet',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="diet-app">
      <header class="diet-header">
        <div class="header-content">
          <button class="back-button" routerLink="/home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 class="title">Plan de Dieta</h1>

          <button class="reset-button" (click)="resetProgress()" title="Reiniciar progreso">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Overlay Offline - No bloqueante -->
      <div *ngIf="!isOnline" class="offline-indicator">
        <div class="offline-content">
          <div class="offline-icon">📶</div>
          <div class="offline-text">
            <h3>Sin conexión</h3>
            <p>Trabajando en modo local</p>
          </div>
        </div>
      </div>

      <!-- Mensaje de reconexión -->
      <div *ngIf="showReconnected" class="reconnected-indicator">
        <div class="reconnected-content">
          <div class="reconnected-icon">✅</div>
          <div class="reconnected-text">
            <h3>¡Conexión restaurada!</h3>
            <p>Sincronizando datos...</p>
          </div>
        </div>
      </div>

      <main class="diet-content">
        <div class="diet-wrapper">
          <div class="header-info">
            <div class="nutrition-icon">🥗</div>
            <h1>Menú Semanal Personalizado</h1>
            <p>Total de calorías aproximado por día: 1000 - 1200 Kcal.</p>

            <div class="progress-info" *ngIf="totalProgress > 0">
              <div class="progress-text">
                Progreso semanal: {{ completedMeals }}/{{ totalMeals }} comidas completadas
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="progressPercentage"></div>
              </div>
            </div>
          </div>

          <div class="diet-list">
            <div 
              *ngFor="let m of menu; let i = index" 
              class="diet-card"
              [class.weekend]="m.day === 'sabado' || m.day === 'domingo'"
              [class.completed]="getDayProgress(i) === 100">
              
              <div class="day-badge">
                <div class="calendar-icon">📅</div>
                <span>{{ getDayName(m.day) }}</span>
                <div class="day-progress" *ngIf="getDayProgress(i) > 0">
                  {{ getDayProgress(i) }}%
                </div>
              </div>
              
              <div class="meals-content">
                <div class="meal-section breakfast" [class.completed]="m.meals.desayunoDone">
                  <div class="meal-header">
                    <div class="meal-icon">☀️</div>
                    <h3>Desayuno</h3>
                    <label class="checkbox-container">
                      <input 
                        type="checkbox" 
                        [checked]="m.meals.desayunoDone"
                        (change)="toggleMeal(i, 'desayunoDone', $event)">
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <p>{{ m.meals.desayuno }}</p>
                </div>
                
                <div class="meal-section lunch" [class.completed]="m.meals.comidaDone">
                  <div class="meal-header">
                    <div class="meal-icon">🥗</div>
                    <h3>Comida</h3>
                    <label class="checkbox-container">
                      <input 
                        type="checkbox" 
                        [checked]="m.meals.comidaDone"
                        (change)="toggleMeal(i, 'comidaDone', $event)">
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <p>{{ m.meals.comida }}</p>
                </div>
                
                <div class="meal-section dinner" [class.completed]="m.meals.cenaDone">
                  <div class="meal-header">
                    <div class="meal-icon">🌙</div>
                    <h3>Cena</h3>
                    <label class="checkbox-container">
                      <input 
                        type="checkbox" 
                        [checked]="m.meals.cenaDone"
                        (change)="toggleMeal(i, 'cenaDone', $event)">
                      <span class="checkmark"></span>
                    </label>
                  </div>
                  <p>{{ m.meals.cena }}</p>
                </div>
              </div>
              
              <div class="weekend-emoji" *ngIf="m.day === 'sabado' || m.day === 'domingo'">
                🎉
              </div>
            </div>
          </div>
        </div>
        
        <p class="disclaimer">
          *Esta es una sugerencia general. Consulta a un nutricionista para un plan adaptado a tus necesidades específicas.
        </p>
      </main>
    </div>
  `,
  styles: [`
    .diet-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f7fbf7;
      position: relative;
    }

    .diet-app::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 250px;
      background: linear-gradient(180deg, rgba(79, 157, 96, 0.04) 0%, transparent 100%);
      pointer-events: none;
    }

    .diet-header {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      position: relative;
    }

    .diet-header::after {
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
      justify-content: space-between;
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
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .reset-button {
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
      transition: all 0.3s ease;
    }

    .reset-button:hover {
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

    /* Indicador Offline - No bloqueante */
    .offline-indicator {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff9800, #f57c00);
      color: white;
      border-radius: 12px;
      padding: 12px 16px;
      box-shadow: 0 8px 32px rgba(255, 152, 0, 0.3);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      max-width: 280px;
    }

    .offline-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .offline-icon {
      font-size: 24px;
      animation: bounce 2s infinite;
    }

    .offline-text h3 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 700;
    }

    .offline-text p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }

    /* Indicador de Reconexión */
    .reconnected-indicator {
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #4caf50, #45a049);
      color: white;
      border-radius: 12px;
      padding: 12px 16px;
      box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      max-width: 280px;
    }

    .reconnected-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .reconnected-icon {
      font-size: 24px;
      animation: scaleIn 0.5s ease-out;
    }

    .reconnected-text h3 {
      margin: 0 0 4px 0;
      font-size: 14px;
      font-weight: 700;
    }

    .reconnected-text p {
      margin: 0;
      font-size: 12px;
      opacity: 0.9;
    }

    .diet-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      position: relative;
    }

    .diet-wrapper {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    }

    .header-info {
      text-align: center;
      margin-bottom: 24px;
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

    .nutrition-icon {
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
      margin: 0 0 16px 0;
      line-height: 1.6;
      font-weight: 600;
    }

    .progress-info {
      margin-top: 16px;
      text-align: center;
    }

    .progress-text {
      font-size: 14px;
      color: #4f9d60;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .progress-bar {
      width: 100%;
      max-width: 300px;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      margin: 0 auto;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .diet-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      animation: fadeInUp 0.6s ease-out 0.15s backwards;
    }

    .diet-card {
      background: linear-gradient(145deg, #ffffff 0%, #f8fdf9 100%);
      border-radius: 18px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 2px solid rgba(79, 157, 96, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .diet-card.completed {
      border-color: rgba(79, 157, 96, 0.5);
      background: linear-gradient(145deg, #f0fff0 0%, #e8f5e9 100%);
    }

    .diet-card.weekend {
      background: linear-gradient(135deg, #f0fff0 0%, #e8f5e9 100%);
      border-color: rgba(79, 157, 96, 0.2);
    }

    .day-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border-radius: 14px;
      color: white;
      font-weight: 800;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      box-shadow: 0 4px 16px rgba(79, 157, 96, 0.15);
      width: fit-content;
      transition: all 0.3s ease;
    }

    .calendar-icon {
      font-size: 20px;
    }

    .day-progress {
      background: rgba(255, 255, 255, 0.3);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
    }

    .meals-content {
      display: grid;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .meals-content {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .meal-section {
      background: white;
      border-radius: 14px;
      padding: 16px;
      border: 2px solid;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
    }

    .meal-section.completed {
      background: linear-gradient(145deg, #f0fff0 0%, #e8f5e9 100%);
      border-color: #4f9d60;
    }

    .meal-section.completed::after {
      content: '✓ Completado';
      position: absolute;
      top: 8px;
      right: 8px;
      background: #4f9d60;
      color: white;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 600;
    }

    .meal-section.breakfast {
      border-color: rgba(255, 167, 38, 0.3);
    }

    .meal-section.lunch {
      border-color: rgba(102, 187, 106, 0.3);
    }

    .meal-section.dinner {
      border-color: rgba(92, 107, 192, 0.3);
    }

    .meal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
    }

    .meal-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      color: #2c5f3d;
      flex: 1;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .checkbox-container input {
      display: none;
    }

    .checkmark {
      width: 24px;
      height: 24px;
      border: 2px solid #ccc;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      background: white;
    }

    .checkbox-container input:checked + .checkmark {
      background: #4f9d60;
      border-color: #4f9d60;
    }

    .checkbox-container input:checked + .checkmark::after {
      content: '✓';
      color: white;
      font-weight: bold;
      font-size: 14px;
    }

    .weekend-emoji {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 36px;
      opacity: 0.25;
      animation: pulse 2s ease-in-out infinite;
      pointer-events: none;
    }

    .disclaimer {
      margin-top: 32px;
      padding: 20px;
      font-size: 14px;
      font-style: italic;
      color: #999;
      line-height: 1.6;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 12px;
      border: 1px dashed rgba(79, 157, 96, 0.2);
      text-align: center;
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

    @keyframes pulse {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.25; }
      50% { transform: scale(1.15) rotate(10deg); opacity: 0.4; }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-5px);
      }
      60% {
        transform: translateY(-2px);
      }
    }

    @keyframes scaleIn {
      0% {
        transform: scale(0);
      }
      70% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }

    @media (max-width: 768px) {
      .header-info {
        padding: 24px 16px;
      }
      
      .header-info h1 {
        font-size: 20px;
      }
      
      .diet-card {
        padding: 18px;
      }
      
      .meals-content {
        gap: 12px;
      }

      .meal-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .checkbox-container {
        align-self: flex-end;
      }

      .offline-indicator,
      .reconnected-indicator {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .nutrition-icon {
        animation: none;
      }

      .weekend-emoji {
        animation: none;
      }

      .offline-icon {
        animation: none;
      }

      .reconnected-icon {
        animation: none;
      }
    }
  `]
})
export class DietComponent implements OnInit, OnDestroy {
  menu: WeeklyMenu[] = [];
  isOnline: boolean = navigator.onLine;
  isUsingCachedData = false;
  showReconnected = false;

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    this.setupConnectionListeners();
    await this.loadMenuData();
  }

  private setupConnectionListeners(): void {
    this.isOnline = navigator.onLine;
    
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  private async loadMenuData(): Promise<void> {
    const ordenSemana = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

    try {
      const data = await this.firebaseService.obtenerMenuSemanal();
      console.log("MENÚ CARGADO:", data);

      const dataOrdenada = data.sort((a: any, b: any) =>
        ordenSemana.indexOf(a.day) - ordenSemana.indexOf(b.day)
      );

      const cachedChecklist = await this.firebaseService.getCachedChecklist();
      
      this.menu = dataOrdenada.map(dayData => {
        const dayName = dayData.day;
        const cachedDay = cachedChecklist[dayName];
        
        return {
          day: dayName,
          meals: {
            desayuno: dayData.desayuno,
            comida: dayData.comida,
            cena: dayData.cena,
            desayunoDone: cachedDay?.desayuno || false,
            comidaDone: cachedDay?.comida || false,
            cenaDone: cachedDay?.cena || false
          }
        };
      });

      this.isUsingCachedData = false;

    } catch (error) {
      console.error("Error cargando el menú:", error);
      this.isUsingCachedData = true;
    }
  }

  getDayName(day: string): string {
    const dayNames: {[key: string]: string} = {
      'lunes': 'Lunes',
      'martes': 'Martes',
      'miercoles': 'Miércoles',
      'jueves': 'Jueves',
      'viernes': 'Viernes',
      'sabado': 'Sábado',
      'domingo': 'Domingo'
    };
    return dayNames[day] || day;
  }

  async toggleMeal(i: number, meal: keyof Meal, event: any) {
    const completed = event.target.checked;

    const updatedMenu = [...this.menu];
    updatedMenu[i] = {
      ...updatedMenu[i],
      meals: {
        ...updatedMenu[i].meals,
        [meal]: completed
      }
    };
    this.menu = updatedMenu;

    const m = this.menu[i].meals;
    const dataFirebase = {
      desayuno: m.desayunoDone,
      comida: m.comidaDone,
      cena: m.cenaDone
    };

    const dayName = this.menu[i].day;

    await this.firebaseService.guardarChecklist(dayName, dataFirebase);
  }

  private handleOnline() {
    this.isOnline = true;
    this.isUsingCachedData = false;
    this.showReconnected = true;
    
    // Mostrar mensaje de reconexión por 3 segundos
    setTimeout(() => {
      this.showReconnected = false;
    }, 3000);
    
    // Sincronizar datos pendientes
    this.firebaseService.syncPendingData();
    
    // Recargar datos
    setTimeout(() => {
      this.loadMenuData();
    }, 1000);
  }

  private handleOffline() {
    this.isOnline = false;
    this.isUsingCachedData = true;
    this.showReconnected = false;
  }

  ngOnDestroy() {
    window.removeEventListener('online', () => this.handleOnline());
    window.removeEventListener('offline', () => this.handleOffline());
  }

  get completedMeals(): number {
    return this.menu.reduce((total, day) => {
      return total + 
        (day.meals.desayunoDone ? 1 : 0) +
        (day.meals.comidaDone ? 1 : 0) +
        (day.meals.cenaDone ? 1 : 0);
    }, 0);
  }

  get totalMeals(): number {
    return this.menu.length * 3;
  }

  get progressPercentage(): number {
    return this.totalMeals > 0
      ? Math.round((this.completedMeals / this.totalMeals) * 100)
      : 0;
  }

  get totalProgress(): number {
    return this.completedMeals;
  }

  getDayProgress(dayIndex: number): number {
    const day = this.menu[dayIndex];
    if (!day) return 0;
    
    const completed = [
      day.meals.desayunoDone,
      day.meals.comidaDone,
      day.meals.cenaDone
    ].filter(Boolean).length;
    
    return Math.round((completed / 3) * 100);
  }

  resetProgress(): void {
    if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso?')) {
      this.menu.forEach(day => {
        day.meals.desayunoDone = false;
        day.meals.comidaDone = false;
        day.meals.cenaDone = false;
      });
      
      this.menu.forEach(day => {
        const data = {
          desayuno: false,
          comida: false,
          cena: false
        };
        this.firebaseService.guardarChecklist(day.day, data);
      });
    }
  }
}
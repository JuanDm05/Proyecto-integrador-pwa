import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';

// Servicio integrado - mismo patrón que usamos en chat
export interface Meal {
  desayuno: string;
  comida: string;
  cena: string;
}

export interface WeeklyMenu {
  day: string;
  meals: Meal;
}

class TemporaryDietService {
  private _menu$ = new BehaviorSubject<WeeklyMenu[]>([
    { 
      day: 'Lunes', 
      meals: { 
        desayuno: 'Avena con bayas y semillas de chía (250 Kcal)', 
        comida: 'Pechuga de pollo a la plancha con ensalada mixta (400 Kcal)', 
        cena: 'Salmón al horno con espárragos (350 Kcal)' 
      } 
    },
    { 
      day: 'Martes', 
      meals: { 
        desayuno: 'Batido de proteína con espinacas (280 Kcal)', 
        comida: 'Bowl de lentejas con arroz integral (450 Kcal)', 
        cena: 'Tortilla de claras con pimientos (250 Kcal)' 
      } 
    },
    { 
      day: 'Miércoles', 
      meals: { 
        desayuno: 'Yogurt griego con nueces (220 Kcal)', 
        comida: 'Tilapia con brócoli y batata (380 Kcal)', 
        cena: 'Sopa de verduras con pollo (300 Kcal)' 
      } 
    },
    { 
      day: 'Jueves', 
      meals: { 
        desayuno: 'Tostada integral con aguacate (300 Kcal)', 
        comida: 'Ensalada César con crutones (420 Kcal)', 
        cena: 'Pavo molido con calabacín (330 Kcal)' 
      } 
    },
    { 
      day: 'Viernes', 
      meals: { 
        desayuno: 'Fruta fresca y queso cottage (200 Kcal)', 
        comida: 'Pasta integral con albóndigas (500 Kcal)', 
        cena: 'Tacos de lechuga con atún (280 Kcal)' 
      } 
    },
    { 
      day: 'Sábado', 
      meals: { 
        desayuno: 'Hotcakes de avena (320 Kcal)', 
        comida: 'Hamburguesa de pollo en pan integral (480 Kcal)', 
        cena: 'Pizza saludable de coliflor (370 Kcal)' 
      } 
    },
    { 
      day: 'Domingo', 
      meals: { 
        desayuno: 'Waffles proteicos con mantequilla de maní (350 Kcal)', 
        comida: 'Pollo con quinoa y frijoles (450 Kcal)', 
        cena: 'Cena libre moderada (600 Kcal)' 
      } 
    },
  ]);

  public menu$ = this._menu$.asObservable();
}

@Component({
  selector: 'app-diet',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="diet-app">
      <!-- Header -->
      <header class="diet-header">
        <div class="header-content">
          <button class="back-button" routerLink="/home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 class="title">Plan de Dieta</h1>
        </div>
      </header>

      <!-- Content -->
      <main class="diet-content">
        <div class="diet-wrapper">
          
          <!-- Header Info -->
          <div class="header-info">
            <div class="nutrition-icon">🥗</div>
            <h1>Menú Semanal Personalizado</h1>
            <p>Total de calorías aproximado por día: 1000 - 1200 Kcal.</p>
          </div>

          <!-- Lista de Menús Diarios -->
          <div class="diet-list">
            <div 
              *ngFor="let m of menu" 
              class="diet-card"
              [class.weekend]="m.day === 'Sábado' || m.day === 'Domingo'">
              
              <!-- Badge del día -->
              <div class="day-badge">
                <div class="calendar-icon">📅</div>
                <span>{{ m.day }}</span>
              </div>
              
              <!-- Contenido de las comidas -->
              <div class="meals-content">
                
                <!-- Desayuno -->
                <div class="meal-section breakfast">
                  <div class="meal-header">
                    <div class="meal-icon">☀️</div>
                    <h3>Desayuno</h3>
                  </div>
                  <p>{{ m.meals.desayuno }}</p>
                </div>
                
                <!-- Comida -->
                <div class="meal-section lunch">
                  <div class="meal-header">
                    <div class="meal-icon">🥗</div>
                    <h3>Comida</h3>
                  </div>
                  <p>{{ m.meals.comida }}</p>
                </div>
                
                <!-- Cena -->
                <div class="meal-section dinner">
                  <div class="meal-header">
                    <div class="meal-icon">🌙</div>
                    <h3>Cena</h3>
                  </div>
                  <p>{{ m.meals.cena }}</p>
                </div>
                
              </div>
              
              <!-- Emoji decorativo para fin de semana -->
              <div class="weekend-emoji" *ngIf="m.day === 'Sábado' || m.day === 'Domingo'">
                🎉
              </div>
            </div>
          </div>
          
        </div>
        
        <p class="disclaimer">
          *Esta es una sugerencia general. Consulta a un nutricionista para un plan adaptado a tus necesidades específicas.
        </p>

        <!-- Notificación de conexión -->
        <div *ngIf="!isOnline" class="offline-banner">
          ⚠️ Estás sin conexión. Algunas funciones pueden no estar disponibles.
        </div>

        <div *ngIf="isOnline && showOnlineBanner" class="online-banner">
          ✅ Conexión establecida
        </div>
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

    .diet-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      position: relative;
      z-index: 1;
    }

    .diet-wrapper {
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    }

    /* Header Info */
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
      margin: 0;
      line-height: 1.6;
      font-weight: 600;
    }

    /* Diet List */
    .diet-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      animation: fadeInUp 0.6s ease-out 0.15s backwards;
    }

    /* Diet Card */
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

    .diet-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 6px;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .diet-card:hover:not(.weekend) {
      transform: translateX(10px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
      border-color: rgba(79, 157, 96, 0.25);
    }

    .diet-card:hover:not(.weekend)::before {
      transform: scaleY(1);
    }

    .diet-card.weekend {
      background: linear-gradient(135deg, #f0fff0 0%, #e8f5e9 100%);
      border-color: rgba(79, 157, 96, 0.2);
    }

    /* Day Badge */
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

    /* Meals Content */
    .meals-content {
      display: grid;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .meals-content {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* Meal Section */
    .meal-section {
      background: white;
      border-radius: 14px;
      padding: 16px;
      border: 2px solid;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .meal-section.breakfast {
      border-color: rgba(255, 167, 38, 0.3);
    }

    .meal-section.breakfast .meal-header {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    }

    .meal-section.lunch {
      border-color: rgba(102, 187, 106, 0.3);
    }

    .meal-section.lunch .meal-header {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    }

    .meal-section.dinner {
      border-color: rgba(92, 107, 192, 0.3);
    }

    .meal-section.dinner .meal-header {
      background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%);
    }

    .meal-section:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    }

    .meal-section p {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      line-height: 1.7;
    }

    /* Meal Header */
    .meal-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
    }

    .meal-icon {
      font-size: 22px;
      line-height: 1;
      animation: bounce 2s ease-in-out infinite;
    }

    .meal-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      color: #2c5f3d;
    }

    /* Weekend Emoji */
    .weekend-emoji {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 36px;
      opacity: 0.25;
      animation: pulse 2s ease-in-out infinite;
      pointer-events: none;
    }

    /* Disclaimer */
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

    /* Connection Banners */
    .offline-banner {
      background: #ffa726;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 1rem 0;
      text-align: center;
      font-weight: 500;
      animation: slideInDown 0.3s ease-out;
    }

    .online-banner {
      background: #4caf50;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 1rem 0;
      text-align: center;
      font-weight: 500;
      animation: slideInDown 0.3s ease-out;
    }

    /* Animations */
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

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.25; }
      50% { transform: scale(1.15) rotate(10deg); opacity: 0.4; }
    }

    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
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
    }
  `]
})
export class DietComponent implements OnInit, OnDestroy {
  menu: WeeklyMenu[] = [];
  private menuSub?: Subscription;
  isOnline = navigator.onLine;
  showOnlineBanner = false;

  // Usar servicio temporal integrado
  private dietService = new TemporaryDietService();

  ngOnInit() {
    // Suscribirse a los cambios del menú
    this.menuSub = this.dietService.menu$.subscribe(m => this.menu = m);

    // Manejar eventos de conexión
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Verificar estado inicial
    if (!this.isOnline) {
      this.handleOffline();
    }
  }

  ngOnDestroy() {
    this.menuSub?.unsubscribe();
    window.removeEventListener('online', () => this.handleOnline());
    window.removeEventListener('offline', () => this.handleOffline());
  }

  private handleOnline() {
    this.isOnline = true;
    this.showOnlineBanner = true;
    
    // Ocultar banner después de 3 segundos
    setTimeout(() => {
      this.showOnlineBanner = false;
    }, 3000);
  }

  private handleOffline() {
    this.isOnline = false;
    this.showOnlineBanner = false;
  }
}
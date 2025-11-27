import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FirebaseService } from '../services/diet.service';



// Servicio integrado - mismo patrón que usamos en chat
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

class TemporaryDietService {
  private storageKey = 'diet-progress';
  private defaultMenu: WeeklyMenu[] = [
    { 
      day: 'Lunes', 
      meals: { 
        desayuno: 'Avena con bayas y semillas de chía (250 Kcal)', 
        comida: 'Pechuga de pollo a la plancha con ensalada mixta (400 Kcal)', 
        cena: 'Salmón al horno con espárragos (350 Kcal)',
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      } 
    },
    { 
      day: 'Martes', 
      meals: { 
        desayuno: 'Batido de proteína con espinacas (280 Kcal)', 
        comida: 'Bowl de lentejas con arroz integral (450 Kcal)', 
        cena: 'Tortilla de claras con pimientos (250 Kcal)',
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      } 
    },
    { 
      day: 'Miércoles', 
      meals: { 
        desayuno: 'Yogurt griego con nueces (220 Kcal)', 
        comida: 'Tilapia con brócoli y batata (380 Kcal)', 
        cena: 'Sopa de verduras con pollo (300 Kcal)',
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      } 
    },
    { 
      day: 'Jueves', 
      meals: { 
        desayuno: 'Tostada integral con aguacate (300 Kcal)', 
        comida: 'Ensalada César con crutones (420 Kcal)', 
        cena: 'Pavo molido con calabacín (330 Kcal)',
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      } 
    },
    { 
      day: 'Viernes', 
      meals: { 
        desayuno: 'Fruta fresca y queso cottage (200 Kcal)', 
        comida: 'Pasta integral con albóndigas (500 Kcal)', 
        cena: 'Tacos de lechuga con atún (280 Kcal)',
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      } 
    },
    { 
      day: 'Sábado', 
      meals: { 
        desayuno: 'Hotcakes de avena (320 Kcal)', 
        comida: 'Hamburguesa de pollo en pan integral (480 Kcal)', 
        cena: 'Pizza saludable de coliflor (370 Kcal)',
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      } 
    },
    { 
      day: 'Domingo', 
      meals: { 
        desayuno: 'Waffles proteicos con mantequilla de maní (350 Kcal)', 
        comida: 'Pollo con quinoa y frijoles (450 Kcal)', 
        cena: 'Cena libre moderada (600 Kcal)',
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      } 
    },
  ];

  private _menu$ = new BehaviorSubject<WeeklyMenu[]>(this.loadMenuFromStorage());

  public menu$ = this._menu$.asObservable();

  private loadMenuFromStorage(): WeeklyMenu[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Combinar el menú por defecto con el progreso guardado
          return this.defaultMenu.map((dayMenu, index) => {
            const storedDay = parsed[index];
            if (storedDay) {
              return {
                ...dayMenu,
                meals: {
                  ...dayMenu.meals,
                  desayunoDone: storedDay.meals?.desayunoDone || false,
                  comidaDone: storedDay.meals?.comidaDone || false,
                  cenaDone: storedDay.meals?.cenaDone || false
                }
              };
            }
            return dayMenu;
          });
        }
      }
    } catch (error) {
      console.error('Error loading menu from storage:', error);
    }
    return this.defaultMenu;
  }

  private saveMenuToStorage(menu: WeeklyMenu[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(menu));
      }
    } catch (error) {
      console.error('Error saving menu to storage:', error);
    }
  }

  updateMealStatus(dayIndex: number, mealType: keyof Meal, completed: boolean): void {
    const currentMenu = this._menu$.value;
    const updatedMenu = [...currentMenu];
    
    updatedMenu[dayIndex] = {
      ...updatedMenu[dayIndex],
      meals: {
        ...updatedMenu[dayIndex].meals,
        [mealType]: completed
      }
    };

    this._menu$.next(updatedMenu);
    this.saveMenuToStorage(updatedMenu);
  }

  resetProgress(): void {
    const resetMenu = this.defaultMenu.map(day => ({
      ...day,
      meals: {
        ...day.meals,
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      }
    }));
    
    this._menu$.next(resetMenu);
    this.saveMenuToStorage(resetMenu);
  }
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
          <button class="reset-button" (click)="resetProgress()" title="Reiniciar progreso">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
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
            <div class="progress-info" *ngIf="totalProgress > 0">
              <div class="progress-text">
                Progreso semanal: {{ completedMeals }}/{{ totalMeals }} comidas completadas
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="progressPercentage"></div>
              </div>
            </div>
          </div>

          <!-- Lista de Menús Diarios -->
          <div class="diet-list">
            <div 
              *ngFor="let m of menu; let i = index" 
              class="diet-card"
              [class.weekend]="m.day === 'Sábado' || m.day === 'Domingo'"
              [class.completed]="getDayProgress(i) === 100">
              
              <!-- Badge del día -->
              <div class="day-badge">
                <div class="calendar-icon">📅</div>
                <span>{{ m.day }}</span>
                <div class="day-progress" *ngIf="getDayProgress(i) > 0">
                  {{ getDayProgress(i) }}%
                </div>
              </div>
              
              <!-- Contenido de las comidas -->
              <div class="meals-content">
                
                <!-- Desayuno -->
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
                
                <!-- Comida -->
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
                
                <!-- Cena -->
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

    .diet-card.completed {
      border-color: rgba(79, 157, 96, 0.5);
      background: linear-gradient(145deg, #f0fff0 0%, #e8f5e9 100%);
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

    .day-progress {
      background: rgba(255, 255, 255, 0.3);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
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

    .meal-section.breakfast.completed {
      border-color: #ff9800;
    }

    .meal-section.breakfast .meal-header {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    }

    .meal-section.lunch {
      border-color: rgba(102, 187, 106, 0.3);
    }

    .meal-section.lunch.completed {
      border-color: #66bb6a;
    }

    .meal-section.lunch .meal-header {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    }

    .meal-section.dinner {
      border-color: rgba(92, 107, 192, 0.3);
    }

    .meal-section.dinner.completed {
      border-color: #5c6bc0;
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

    .meal-icon {
      font-size: 22px;
      line-height: 1;
      animation: bounce 2s ease-in-out infinite;
    }

    /* Checkbox Styles */
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

    .checkbox-container:hover .checkmark {
      border-color: #4f9d60;
      transform: scale(1.1);
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

      .meal-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .checkbox-container {
        align-self: flex-end;
      }
    }
  `]
})
export class DietComponent implements OnInit, OnDestroy {
  constructor(private firebaseService: FirebaseService) {}

  menu: WeeklyMenu[] = [];
  subscription!: Subscription;
  isOnline = true;
  showOnlineBanner = false;


  private dietService = new TemporaryDietService();

async ngOnInit(): Promise<void> {

  // Orden correcto de la semana
  const ordenSemana = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo"
  ];

  try {
    // 1. Cargar menú desde Firebase
    const data = await this.firebaseService.obtenerMenuSemanal();
    console.log("MENÚ DESDE FIREBASE:", data);

    // 2. Ordenar según la semana
    const dataOrdenada = data.sort((a: any, b: any) =>
      ordenSemana.indexOf(a.day) - ordenSemana.indexOf(b.day)
    );

    // 3. Mapear con flags de checklist
    this.menu = dataOrdenada.map(d => ({
      day: d.day,
      meals: {
        desayuno: d.desayuno,
        comida: d.comida,
        cena: d.cena,
        desayunoDone: false,
        comidaDone: false,
        cenaDone: false
      }
    }));

  } catch (error) {
    console.error("Error cargando el menú:", error);
  }


  // 2. Estado de conexión (esto lo dejas igual)
  this.isOnline = navigator.onLine;
}


  ngOnDestroy() {
    this.subscription?.unsubscribe();
    window.removeEventListener('online', () => this.handleOnline());
    window.removeEventListener('offline', () => this.handleOffline());
  }

  // Propiedades computadas para el progreso
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

  // Método para obtener el progreso de un día específico
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

  // Método para alternar el estado de una comida
toggleMeal(i: number, meal: keyof Meal, event: any) {
  const completed = event.target.checked;

  this.dietService.updateMealStatus(i, meal, completed);

  const m = this.menu[i].meals;

  const dataFirebase = {
    desayuno: m.desayunoDone,
    comida: m.comidaDone,
    cena: m.cenaDone
  };

  const dayName = this.menu[i].day;

  this.firebaseService.guardarChecklist(dayName, dataFirebase)
    .then(() => console.log("Guardado en Firebase", dayName))
    .catch(err => console.error("Error Firebase:", err));
}



  // Método para reiniciar el progreso
  resetProgress(): void {
    if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso?')) {
      this.dietService.resetProgress();
    }
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
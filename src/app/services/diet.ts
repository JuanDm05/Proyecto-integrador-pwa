import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Meal {
  desayuno: string;
  comida: string;
  cena: string;
}

export interface WeeklyMenu {
  day: string;
  meals: Meal;
}

const STORAGE_KEY = 'diet_menu_v1';

@Injectable({ 
  providedIn: 'root' 
})
export class DietService {
  private _menu$ = new BehaviorSubject<WeeklyMenu[]>(this.loadFromStorage());
  public menu$ = this._menu$.asObservable();

  constructor() {}

  private defaultMenu(): WeeklyMenu[] {
    return [
      { 
        day: 'Lunes', 
        meals: { 
          desayuno: 'Avena con bayas y semillas de chía (250 Kcal)', 
          comida: 'Pechuga de pollo a la plancha con ensalada mixta y aceite de oliva (400 Kcal)', 
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
          cena: 'Cena libre moderada (600–800 Kcal)' 
        } 
      },
    ];
  }

  private loadFromStorage(): WeeklyMenu[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as WeeklyMenu[];
      }
    } catch (e) {
      console.warn('Error leyendo storage diet:', e);
    }
    const def = this.defaultMenu();
    this.saveToStorage(def);
    return def;
  }

  private saveToStorage(menu: WeeklyMenu[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menu));
      this._menu$.next(menu);
    } catch (e) {
      console.warn('Error guardando diet en storage:', e);
    }
  }

  // Para actualizar desde servidor si existe un endpoint (opcional)
  applyRemoteMenu(menu: WeeklyMenu[]) {
    this.saveToStorage(menu);
  }

  getSnapshot(): WeeklyMenu[] {
    return this._menu$.getValue();
  }

  // Métodos adicionales útiles
  getDayMenu(dayName: string): WeeklyMenu | undefined {
    return this.getSnapshot().find(menu => menu.day === dayName);
  }

  getTodayMenu(): WeeklyMenu | undefined {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const today = new Date().getDay();
    const todayName = days[today];
    return this.getDayMenu(todayName);
  }

  // Método para actualizar un día específico
  updateDayMenu(dayName: string, newMeals: Meal) {
    const currentMenu = this.getSnapshot();
    const updatedMenu = currentMenu.map(menu => 
      menu.day === dayName ? { ...menu, meals: newMeals } : menu
    );
    this.saveToStorage(updatedMenu);
  }

  // Método para resetear al menú por defecto
  resetToDefault() {
    const defaultMenu = this.defaultMenu();
    this.saveToStorage(defaultMenu);
  }

  // Método para calcular calorías totales del día
  calculateDayCalories(dayName: string): number {
    const dayMenu = this.getDayMenu(dayName);
    if (!dayMenu) return 0;

    const calorieRegex = /\((\d+)\s*Kcal\)/;
    let total = 0;

    Object.values(dayMenu.meals).forEach(meal => {
      const match = meal.match(calorieRegex);
      if (match) {
        total += parseInt(match[1], 10);
      }
    });

    return total;
  }

  // Método para obtener resumen semanal
  getWeeklySummary(): { day: string; totalCalories: number }[] {
    return this.getSnapshot().map(menu => ({
      day: menu.day,
      totalCalories: this.calculateDayCalories(menu.day)
    }));
  }
}
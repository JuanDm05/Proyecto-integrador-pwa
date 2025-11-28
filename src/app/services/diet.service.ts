import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { collection, getDocs } from 'firebase/firestore';

// Interface para los datos del menú
interface MenuData {
  desayuno?: string;
  comida?: string;
  cena?: string;
  [key: string]: any; // Para otras propiedades que puedan existir
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private readonly CACHE_NAME = 'diet-cache-v1';
  private readonly MENU_CACHE_KEY = 'weekly-menu';
  private readonly CHECKLIST_CACHE_KEY = 'checklist-data';

  constructor() {
    this.initializeCache();
  }

  private async initializeCache(): Promise<void> {
    if ('caches' in window) {
      try {
        await caches.open(this.CACHE_NAME);
      } catch (error) {
        console.error('Error inicializando cache:', error);
      }
    }
  }

  async obtenerMenuSemanal(): Promise<any[]> {
    // Primero intentar obtener del cache
    const cachedMenu = await this.getFromCache(this.MENU_CACHE_KEY);
    if (cachedMenu && cachedMenu.length > 0) {
      console.log('📦 Menú cargado desde cache');
      return cachedMenu;
    }

    try {
      // Obtener de Firebase - colección menus (datos reales)
      const ref = collection(this.db, 'menus');
      const snapshot = await getDocs(ref);

      const menu: any[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as MenuData;
        menu.push({
          day: doc.id,
          desayuno: data.desayuno || 'Comida no definida',
          comida: data.comida || 'Comida no definida', 
          cena: data.cena || 'Comida no definida'
        });
      });

      console.log('🔥 Menú REAL desde Firebase:', menu);

      if (menu.length === 0) {
        console.warn('⚠️ No hay datos en la colección menus');
        throw new Error('No hay datos en Firebase');
      }

      // Guardar en cache
      await this.saveToCache(this.MENU_CACHE_KEY, menu);
      return menu;

    } catch (error) {
      console.error('❌ Error cargando menú REAL:', error);
      
      // Si hay error, lanzar excepción para que el componente lo maneje
      throw error;
    }
  }

  async guardarChecklist(dia: string, data: any): Promise<void> {
    console.log("💾 Guardando checklist:", dia, data);

    try {
      const ref = doc(this.db, 'comidas', dia);
      const dataWithTimestamp = {
        ...data,
        fechaGuardado: new Date(),
        lastSync: new Date().toISOString()
      };

      // Guardar en Firebase
      await setDoc(ref, dataWithTimestamp);
      
      // Guardar en cache local
      await this.saveChecklistToCache(dia, dataWithTimestamp);
      console.log('✅ Datos guardados en Firebase y cache local');

    } catch (error) {
      console.error('❌ Error guardando en Firebase:', error);
      
      // Si estamos offline, guardar solo en cache
      await this.saveChecklistToCache(dia, {
        ...data,
        fechaGuardado: new Date(),
        pendingSync: true
      });
      console.log('💾 Datos guardados en cache local (pendiente de sincronización)');
    }
  }

  async obtenerChecklist(dia: string): Promise<any> {
    try {
      const ref = doc(this.db, 'comidas', dia);
      const snapshot = await getDoc(ref);
      
      if (snapshot.exists()) {
        return snapshot.data();
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo checklist:', error);
      return null;
    }
  }

  private async getFromCache(key: string): Promise<any> {
    if (!('caches' in window)) return null;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const response = await cache.match(`/${key}`);
      
      if (response) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Error accediendo al cache:', error);
    }
    
    return null;
  }

  private async saveToCache(key: string, data: any): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.CACHE_NAME);
      const response = new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'x-cache-time': new Date().toISOString()
        }
      });
      
      await cache.put(`/${key}`, response);
    } catch (error) {
      console.warn('Error guardando en cache:', error);
    }
  }

  private async saveChecklistToCache(dia: string, data: any): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const currentChecklist = await this.getFromCache(this.CHECKLIST_CACHE_KEY) || {};
      currentChecklist[dia] = data;
      await this.saveToCache(this.CHECKLIST_CACHE_KEY, currentChecklist);
    } catch (error) {
      console.warn('Error guardando checklist en cache:', error);
    }
  }

  async getCachedChecklist(): Promise<any> {
    return await this.getFromCache(this.CHECKLIST_CACHE_KEY) || {};
  }

  async syncPendingData(): Promise<void> {
    if (!navigator.onLine) return;

    try {
      const pendingData = await this.getFromCache(this.CHECKLIST_CACHE_KEY);
      if (!pendingData) return;

      for (const [dia, data] of Object.entries(pendingData)) {
        if ((data as any).pendingSync) {
          console.log(`🔄 Sincronizando datos pendientes para: ${dia}`);
          const { pendingSync, ...cleanData } = data as any;
          await this.guardarChecklist(dia, cleanData);
        }
      }
    } catch (error) {
      console.error('Error sincronizando datos pendientes:', error);
    }
  }

  // Método para limpiar cache si es necesario
  async clearCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      await caches.delete(this.CACHE_NAME);
      console.log('🧹 Cache limpiado');
    } catch (error) {
      console.error('Error limpiando cache:', error);
    }
  }
}
import { Injectable, inject } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection, 
  getDocs 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private auth = getAuth(this.app); // Añade Auth
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
  const cachedMenu = await this.getFromCache(this.MENU_CACHE_KEY);
  if (cachedMenu && cachedMenu.length > 0) {
    console.log('📦 Menú cargado desde cache');
    return cachedMenu;
  }

  try {
    const ref = collection(this.db, 'menus');
    const snapshot = await getDocs(ref);

    const menu: any[] = [];
    
    // Definir los días que queremos (con mayúsculas iniciales)
    const diasEsperadosMayusculas = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    
    snapshot.forEach(doc => {
      const id = doc.id;
      const data = doc.data();
      
      // Solo procesar si está en la lista de días con mayúsculas
      if (diasEsperadosMayusculas.includes(id)) {
        menu.push({
          day: id.toLowerCase(), // Convertir a minúsculas para consistencia
          desayuno: data['desayuno'] || 'Comida no definida',
          comida: data['comida'] || 'Comida no definida', 
          cena: data['cena'] || 'Comida no definida'
        });
        console.log(`✅ Agregado: ${id}`);
      } else {
        console.warn(`⚠️ Ignorado: ${id} (no es un día esperado con mayúsculas)`);
      }
    });

    console.log('🔥 Menú procesado:', menu);

    // Si faltan días, agregarlos
    if (menu.length < 7) {
      const diasObtenidos = menu.map(m => m.day);
      const diasFaltantes = diasEsperadosMayusculas
        .map(d => d.toLowerCase())
        .filter(dia => !diasObtenidos.includes(dia));
      
      if (diasFaltantes.length > 0) {
        console.warn(`⚠️ Faltan días: ${diasFaltantes.join(', ')} (agregando por defecto)`);
        
        for (const dia of diasFaltantes) {
          menu.push({
            day: dia,
            desayuno: 'Desayuno del día',
            comida: 'Comida del día',
            cena: 'Cena del día'
          });
        }
      }
    }

    // Ordenar
    const ordenDias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    menu.sort((a, b) => ordenDias.indexOf(a.day) - ordenDias.indexOf(b.day));

    await this.saveToCache(this.MENU_CACHE_KEY, menu);
    return menu;

  } catch (error) {
    console.error('❌ Error cargando menú:', error);
    throw error;
  }
}

async guardarChecklist(dia: string, data: { desayuno: boolean, comida: boolean, cena: boolean }): Promise<void> {
  console.log("💾 Guardando checklist:", dia, data);

  try {
    // Obtener el usuario actual
    const user = this.auth.currentUser;
    
    if (!user) {
      console.error('❌ No hay usuario autenticado');
      // Guardar solo los 3 campos en cache
      await this.saveChecklistToCache(dia, {
        ...data,
        pendingSync: true
      });
      return;
    }

    const uid = user.uid;
    
    // GUARDAR EN LA RUTA CORRECTA: comidasMarcadas/{uid}/dias/{dia}
    const ref = doc(this.db, 'comidasMarcadas', uid, 'dias', dia.toLowerCase());
    
    // SOLO LOS 3 CAMPOS, SIN METADATOS
    await setDoc(ref, data, { merge: true });
    
    // Guardar en cache local (solo los 3 campos)
    await this.saveChecklistToCache(dia, data);
    
    console.log('✅ Datos guardados en Firebase:', ref.path);

  } catch (error: any) {
    console.error('❌ Error guardando en Firebase:', error);
    
    // Si hay error, guardar en cache con pendingSync
    await this.saveChecklistToCache(dia, {
      ...data,
      pendingSync: true
    });
    
    console.log('💾 Datos guardados en cache local (pendiente de sincronización)');
  }
}

  async obtenerChecklist(dia: string): Promise<any> {
    try {
      const user = this.auth.currentUser;
      
      if (!user) {
        console.warn('⚠️ No hay usuario autenticado, obteniendo de cache');
        const cached = await this.getCachedChecklist();
        return cached[dia] || null;
      }

      const uid = user.uid;
      // OBTENER DESDE LA RUTA CORRECTA: comidasMarcadas/{uid}/dias/{dia}
      const ref = doc(this.db, 'comidasMarcadas', uid, 'dias', dia);
      const snapshot = await getDoc(ref);
      
      if (snapshot.exists()) {
        return snapshot.data();
      }
      
      // Si no existe en Firebase, buscar en cache
      const cached = await this.getCachedChecklist();
      return cached[dia] || null;
      
    } catch (error) {
      console.error('Error obteniendo checklist:', error);
      
      // Fallback a cache
      const cached = await this.getCachedChecklist();
      return cached[dia] || null;
    }
  }

  // Método para cargar todo el checklist del usuario
  async cargarChecklistCompleto(): Promise<Record<string, any>> {
    try {
      const user = this.auth.currentUser;
      
      if (!user) {
        console.warn('⚠️ No hay usuario autenticado');
        return await this.getCachedChecklist() || {};
      }

      const uid = user.uid;
      
      // Obtener desde la estructura: comidasMarcadas/{uid}/dias
      const dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
      
      const checklist: Record<string, any> = {};
      
      for (const dia of dias) {
        const ref = doc(this.db, 'comidasMarcadas', uid, 'dias', dia.toLowerCase());
        const snapshot = await getDoc(ref);
        
        if (snapshot.exists()) {
          checklist[dia.toLowerCase()] = snapshot.data();
        }
      }
      
      return checklist;
      
    } catch (error) {
      console.error('Error cargando checklist completo:', error);
      return await this.getCachedChecklist() || {};
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
    
    // Solo guardar los 3 campos esenciales + pendingSync si existe
    currentChecklist[dia.toLowerCase()] = {
      desayuno: data.desayuno || false,
      comida: data.comida || false,
      cena: data.cena || false,
      ...(data.pendingSync && { pendingSync: true })
    };
    
    await this.saveToCache(this.CHECKLIST_CACHE_KEY, currentChecklist);
  } catch (error) {
    console.warn('Error guardando checklist en cache:', error);
  }
}

async getCachedChecklist(): Promise<Record<string, { desayuno: boolean, comida: boolean, cena: boolean }>> {
  const cached = await this.getFromCache(this.CHECKLIST_CACHE_KEY) || {};
  
  // Limpiar los datos para devolver solo los 3 campos
  const cleaned: Record<string, { desayuno: boolean, comida: boolean, cena: boolean }> = {};
  
  Object.keys(cached).forEach(dia => {
    const data = cached[dia];
    cleaned[dia] = {
      desayuno: data.desayuno || false,
      comida: data.comida || false,
      cena: data.cena || false
    };
  });
  
  return cleaned;
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
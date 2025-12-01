import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({ 
  providedIn: 'root' 
})
export class UserDataService {
  private firestore = inject(Firestore);

  async createUserDataStructure(uid: string): Promise<boolean> {
    if (!uid) {
      console.error('UID no proporcionado');
      return false;
    }

    try {
      // 1. Crear documento principal si no existe
      const userDoc = doc(this.firestore, `comidasMarcadas/${uid}`);
      await setDoc(userDoc, {
        createdAt: new Date(),
        lastUpdated: new Date()
      }, { merge: true });

      console.log(`Documento principal creado para usuario: ${uid}`);

      // 2. Crear estructura de días
      const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
      
      for (const dia of dias) {
        const diaDoc = doc(this.firestore, `comidasMarcadas/${uid}/dias/${dia}`);
        await setDoc(diaDoc, {
          desayuno: false,
          comida: false,
          cena: false,
        }, { merge: true });
      }

      console.log(`Estructura de días creada para usuario: ${uid}`);
      return true;

    } catch (error: any) {
      console.error('Error creando estructura de datos:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje:', error.message);
      return false;
    }
  }
}
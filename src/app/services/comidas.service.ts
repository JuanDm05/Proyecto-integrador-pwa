import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class ComidasService {

  diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  constructor(private firestore: Firestore, private auth: Auth) {}

  // ======================================================
  // 1. Inicializar datos del usuario si no existen
  // ======================================================
  async inicializarUsuarioSiNoExiste() {
    const user = this.auth.currentUser;
    if (!user) return;

    const userDocRef = doc(this.firestore, `comidasMarcadas/${user.uid}`);
    const userDoc = await getDoc(userDocRef);

    // Si NO EXISTE el documento, lo creamos vacío
    if (!userDoc.exists()) {
      await setDoc(userDocRef, { creado: new Date() });
      console.log("Documento base creado para el usuario:", user.uid);
    }

    // Ahora vamos a crear la subcolección "dias" con los 7 días
    for (const dia of this.diasSemana) {
      const diaDocRef = doc(this.firestore, `comidasMarcadas/${user.uid}/dias/${dia}`);
      const diaDoc = await getDoc(diaDocRef);

      if (!diaDoc.exists()) {
        await setDoc(diaDocRef, {
          desayuno: false,
          comida: false,
          cena: false
        });
        console.log(`Día ${dia} creado para el usuario ${user.uid}`);
      }
    }
  }

  // ======================================================
  // 2. Obtener un día en particular
  // ======================================================
  async getDia(dia: string) {
    const user = this.auth.currentUser;
    if (!user) return null;

    const ref = doc(this.firestore, `comidasMarcadas/${user.uid}/dias/${dia}`);
    const snap = await getDoc(ref);
    return snap.data();
  }

  // ======================================================
  // 3. Actualizar un día (ej: marcar desayuno = true)
  // ======================================================
  async actualizarDia(dia: string, data: any) {
    const user = this.auth.currentUser;
    if (!user) return;

    const ref = doc(this.firestore, `comidasMarcadas/${user.uid}/dias/${dia}`);
    return updateDoc(ref, data);
  }
}

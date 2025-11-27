import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { collection, getDocs } from 'firebase/firestore';


@Injectable({ providedIn: 'root' })
export class FirebaseService {

  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);


async obtenerMenuSemanal() {
  const ref = collection(this.db, 'menus');
  const snapshot = await getDocs(ref);

  const menu: any[] = [];

  snapshot.forEach(doc => {
    menu.push({
      day: doc.id,
      ...doc.data()
    });
  });

  return menu;
}

  async guardarChecklist(dia: string, data: any) {
      console.log("🔥 Guardando en Firestore:", dia, data);

    const ref = doc(this.db, 'comidas', dia);

    return await setDoc(ref, {
      ...data,
      fechaGuardado: new Date()
    });
  }
}

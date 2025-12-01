import { Injectable, inject } from '@angular/core';
import { Auth,
         EmailAuthProvider,
         reauthenticateWithCredential,
         updatePassword,
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         signOut, 
         GoogleAuthProvider, 
         signInWithPopup,
         sendPasswordResetEmail
       } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Usar inject() en lugar de constructor injection
  private auth = inject(Auth);

  // Ya NO necesitas el constructor
  // constructor(private auth: Auth) {}

  // Registro
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Login con Google
  loginGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const user = this.auth.currentUser;

    if (!user || !user.email) {
      throw new Error("No hay usuario autenticado.");
    }

    // 1. Credenciales para reautenticar
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    // 2. Reautenticar
    await reauthenticateWithCredential(user, credential);

    // 3. Cambiar la contraseña
    return updatePassword(user, newPassword);
  }

  async resetPassword(email: string) {
    if (!email) throw new Error("Debes ingresar un correo válido.");
    return await sendPasswordResetEmail(this.auth, email);
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Estado del usuario
  get currentUser() {
    return this.auth.currentUser;
  }
}
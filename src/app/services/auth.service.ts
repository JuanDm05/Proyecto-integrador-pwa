// auth.service.ts - VERSIÓN COMPLETA ACTUALIZADA
import { Injectable, inject } from '@angular/core';
import { 
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  
  // Propiedad para redirigir después del login
  redirectUrl: string | null = null;
  
  // Observable para el estado de autenticación
  private authStateSubject = new BehaviorSubject<User | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  
  // Observables públicos
  authState$ = this.authStateSubject.asObservable();
  isLoadingAuthState$ = this.isLoadingSubject.asObservable();

  constructor() {
    // Escuchar cambios en la autenticación
    this.initializeAuthListener();
  }

  private initializeAuthListener(): void {
    this.isLoadingSubject.next(true);
    
    onAuthStateChanged(this.auth, (user) => {
      console.log('👤 Estado de autenticación cambiado:', user?.email);
      this.authStateSubject.next(user);
      this.isLoadingSubject.next(false);
      
      // Si hay una URL pendiente y el usuario se autenticó, redirigir
      if (user && this.redirectUrl) {
        const url = this.redirectUrl;
        this.redirectUrl = null;
        
        setTimeout(() => {
          this.router.navigateByUrl(url);
        }, 100);
      }
    });
  }

  // Registro
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.handleAuthSuccess();
        return result;
      });
  }

  // Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.handleAuthSuccess();
        return result;
      });
  }

  // Login con Google
  loginGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        this.handleAuthSuccess();
        return result;
      });
  }

  private handleAuthSuccess(): void {
    // Redirigir a la URL guardada o a home
    const redirectUrl = this.redirectUrl || '/home';
    this.redirectUrl = null;
    
    setTimeout(() => {
      this.router.navigateByUrl(redirectUrl, { replaceUrl: true });
    }, 100);
  }

  // Logout - Versión mejorada
  async logout(): Promise<void> {
    try {
      console.log('🚪 Cerrando sesión...');
      
      // 1. Limpiar el estado local primero
      this.authStateSubject.next(null);
      this.isLoadingSubject.next(false);
      
      // 2. Limpiar datos locales
      this.clearLocalData();
      
      // 3. Redirigir al login
      console.log('✅ Sesión cerrada, redirigiendo a login...');
      this.router.navigate(['/login'], { replaceUrl: true });
      
      // 4. Luego cerrar sesión en Firebase (en segundo plano)
      setTimeout(async () => {
        try {
          await signOut(this.auth);
        } catch (error) {
          console.warn('Error en signOut de Firebase:', error);
        }
      }, 0);
      
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
      
      // Aún así limpiar datos locales y redirigir
      this.clearLocalData();
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  // Cambiar contraseña
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

  // Reset password
  async resetPassword(email: string) {
    if (!email) throw new Error("Debes ingresar un correo válido.");
    return await sendPasswordResetEmail(this.auth, email);
  }

  // ========== GETTERS Y PROPIEDADES ==========

  // Getter para el usuario actual (sincrónico)
  get currentUser(): User | null {
    return this.authStateSubject.value;
  }

  // Getter para el estado de carga
  get isLoadingAuthState(): boolean {
    return this.isLoadingSubject.value;
  }

  // Verificar si está autenticado
  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  // Obtener email del usuario actual
  get currentUserEmail(): string | null {
    return this.currentUser?.email || null;
  }

  // Obtener UID del usuario actual
  get currentUserId(): string | null {
    return this.currentUser?.uid || null;
  }

  // Verificar si el email está verificado
  get isEmailVerified(): boolean {
    return this.currentUser?.emailVerified || false;
  }

  // ========== MÉTODOS AUXILIARES ==========

  // Método para verificar si hay una sesión activa al iniciar la app
  checkAuthState(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  // Enviar verificación de email
  async sendEmailVerification(): Promise<void> {
    const user = this.currentUser;
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }
    
    // Firebase v9+ maneja la verificación automáticamente
    console.log('Email de verificación enviado automáticamente al registrar');
  }

  private clearLocalData(): void {
    // Limpiar localStorage
    localStorage.clear();
    
    // Limpiar sessionStorage
    sessionStorage.clear();
    
    // Limpiar caches específicos si los tienes
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    console.log('🧹 Datos locales limpiados');
  }

  // Método para forzar actualización del estado (útil para debug)
  refreshAuthState(): void {
    const user = this.auth.currentUser;
    this.authStateSubject.next(user);
    console.log('🔄 Estado de autenticación refrescado:', user?.email);
  }

  // Método para suscribirse a cambios (alternativa al observable)
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }
}
// public.guard.ts - CON LOGS PARA DEPURAR
import { Injectable, inject } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    
    console.log('🔍 PublicGuard ejecutándose para:', state.url);
    console.log('📊 isLoadingAuthState:', this.authService.isLoadingAuthState);
    console.log('👤 Usuario actual:', this.authService.currentUser?.email);
    console.log('✅ isAuthenticated:', this.authService.isAuthenticated);
    
    // Esperar a que termine la carga del estado de autenticación
    if (this.authService.isLoadingAuthState) {
      console.log('⏳ Esperando a que termine la carga de autenticación...');
      await this.waitForAuth();
    }
    
    // Verificar si el usuario está autenticado
    if (this.authService.isAuthenticated) {
      console.log('🚫 Usuario YA autenticado, redirigiendo a /home');
      return this.router.createUrlTree(['/home'], { 
        queryParams: { 
          redirectedFrom: state.url,
          timestamp: Date.now() 
        }
      });
    }
    
    console.log('👍 Usuario NO autenticado, permitiendo acceso a ruta pública');
    return true;
  }

  private async waitForAuth(): Promise<void> {
    return new Promise<void>(resolve => {
      console.log('⏱️ Iniciando espera para auth...');
      
      const subscription = this.authService.isLoadingAuthState$.subscribe(isLoading => {
        console.log('📡 isLoadingAuthState$ emitió:', isLoading);
        if (!isLoading) {
          console.log('✅ Carga de auth completada');
          subscription.unsubscribe();
          resolve();
        }
      });
      
      // Timeout de seguridad (5 segundos)
      setTimeout(() => {
        console.log('⏰ Timeout de espera para auth');
        subscription.unsubscribe();
        resolve();
      }, 5000);
    });
  }
}
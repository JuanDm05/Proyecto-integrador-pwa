// auth.guard.ts
import { Injectable, inject } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Si ya tenemos un usuario, permitir acceso
    if (this.authService.currentUser) {
      return true;
    }
    
    // Si no hay usuario, verificar si está cargando
    if (this.authService.isLoadingAuthState) {
      // Esperar a que termine la carga
      return this.waitForAuth();
    }
    
    // No autenticado y no está cargando, redirigir a login
    console.log('🔒 Acceso denegado, redirigiendo a login');
    this.authService.redirectUrl = state.url;
    return this.router.createUrlTree(['/login']);
  }

  private waitForAuth(): Observable<boolean | UrlTree> {
    return new Observable<boolean | UrlTree>(observer => {
      const checkAuth = () => {
        if (this.authService.currentUser) {
          observer.next(true);
          observer.complete();
        } else if (!this.authService.isLoadingAuthState) {
          // Terminó de cargar y no hay usuario
          observer.next(this.router.createUrlTree(['/login']));
          observer.complete();
        } else {
          // Seguir esperando
          setTimeout(checkAuth, 100);
        }
      };
      
      checkAuth();
    });
  }
}
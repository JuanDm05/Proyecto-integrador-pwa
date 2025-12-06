import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DietComponent } from './diet/diet.component';
import { RoutinesComponent } from './routines/routines.component';
import { ChatComponent } from './chat/chat.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './password/password.component';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';
import { AuthGuard } from '../app/services/auth.guard';
import { PublicGuard } from '../app/services/public.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [PublicGuard]
  }, 
  {
    path: 'olvide-password',
    loadComponent: () => import('./forgotPassword/forgotPassword.component').then(m => m.ForgotPasswordComponent),
    canActivate: [PublicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    canActivate: [PublicGuard]
  },
  {
    path: 'routines',
    loadComponent: () => import('./routines/routines.component').then(m => m.RoutinesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'diet',
    loadComponent: () => import('./diet/diet.component').then(m => m.DietComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'cambiar-contrasena',
    loadComponent: () => import('./password/password.component').then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '/home' } // Ruta comodín para 404

];
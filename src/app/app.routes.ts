import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DietComponent } from './diet/diet.component';
import { RoutinesComponent } from './routines/routines.component';
import { ChatComponent } from './chat/chat.component';
import { ChangePasswordComponent } from './password/password.component';
import { ForgotPasswordComponent } from './forgotPassword/forgotPassword.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'diet', component: DietComponent },
  { path: 'routines', component: RoutinesComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'cambiar-contrasena', component: ChangePasswordComponent },
  { path: 'olvide-password', component: ForgotPasswordComponent },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)},
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '/home' } // Ruta comodín para 404

];
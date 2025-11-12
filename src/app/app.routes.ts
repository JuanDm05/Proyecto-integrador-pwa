import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DietComponent } from './diet/diet.component';
import { RoutinesComponent } from './routines/routines.component';
import { ChatComponent } from './chat/chat.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'diet', component: DietComponent },
  { path: 'routines', component: RoutinesComponent },
  { path: 'chat', component: ChatComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '/home' } // Ruta comodín para 404
];
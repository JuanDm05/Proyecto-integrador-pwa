import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OfflineService } from './services/offline.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <!-- Offline Indicator GLOBAL -->
    <div *ngIf="(offlineService.isOnline$ | async) === false" class="offline-banner">
      <div class="offline-content">
        <span class="offline-icon">📶</span>
        <span class="offline-text">Modo sin conexión - Los datos se cargarán desde la caché</span>
      </div>
    </div>
    
    <router-outlet></router-outlet>
  `,
  styles: [`
    .offline-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ffa726;
      color: white;
      padding: 12px 16px;
      text-align: center;
      z-index: 10000;
      animation: slideDown 0.3s ease-out;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-size: 14px;
      font-weight: 600;
    }
    
    .offline-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .offline-icon {
      font-size: 18px;
    }
    
    .offline-text {
      flex: 1;
    }
    
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .offline-banner {
        padding: 10px 12px;
        font-size: 13px;
      }
      
      .offline-content {
        gap: 6px;
      }
    }
  `]
})
export class App {
  constructor(public offlineService: OfflineService) {
    // Debug
    this.offlineService.isOnline$.subscribe(online => {
      console.log('🔌 Estado conexión:', online ? 'ONLINE' : 'OFFLINE');
    });
  }
}
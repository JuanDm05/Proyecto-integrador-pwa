import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.updateOnlineStatus());
      window.addEventListener('offline', () => this.updateOnlineStatus());
    }
  }

  private updateOnlineStatus(): void {
    this.isOnlineSubject.next(navigator.onLine);
  }

  get isOnline(): boolean {
    return navigator.onLine;
  }

  canCache(): boolean {
    return typeof localStorage !== 'undefined' && typeof caches !== 'undefined';
  }
}
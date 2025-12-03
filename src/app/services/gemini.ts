import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// Ya no necesitamos environment.secrets para la key de Gemini

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  
  // AHORA APUNTAMOS A NUESTRA PROPIA API EN VERCEL
  // La ruta relativa '/api/gemini' funciona automáticamente en producción
  private apiUrl = '/api/gemini'; 

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    if (!message.trim()) {
      return throwError(() => new Error('Mensaje vacío'));
    }

    const body = {
      contents: [{
        role: "user",
        parts: [{
          text: message
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
        topP: 0.9,
        topK: 40
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Enviando solicitud al servidor seguro (Vercel)...');
    
    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError(error => {
        console.error('Error en la comunicación con el servidor:', error);
        return throwError(() => this.handleApiError(error));
      })
    );
  }

  private handleApiError(error: any): Error {
    // Los códigos de error ahora vienen de tu servidor Vercel
    if (error.status === 500) {
      return new Error('Error interno del servidor o Key no configurada.');
    } else if (error.status === 404) {
      return new Error('No se encontró el endpoint /api/gemini');
    }
    // Puedes mantener la lógica original si tu proxy devuelve los mismos códigos
    return new Error(`Error ${error.status}: ${error.message || 'Desconocido'}`);
  }

  testConnection(): Observable<any> {
    const testBody = {
      contents: [{
        role: "user",
        parts: [{
          text: "Hola"
        }]
      }],
      generationConfig: {
        maxOutputTokens: 5
      }
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, testBody, { headers });
  }
}
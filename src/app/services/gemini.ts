import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.secrets';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  // Tu API Key
    private apiKey = environment.geminiApiKey;
  
  // ✅ MODELO MÁS BÁSICO Y GRATUITO - Gemini 2.0 Flash Lite
  private apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${this.apiKey}`;

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    // Validación
    if (!message.trim()) {
      return throwError(() => new Error('Mensaje vacío'));
    }

    // Prompt más simple y directo
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

    console.log('Enviando a Gemini 2.0 Flash Lite...');
    
    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError(error => {
        console.error('Error Gemini API:', error);
        
        // Log detallado para debugging
        if (error.error) {
          console.error('Error details:', JSON.stringify(error.error, null, 2));
        }
        
        return throwError(() => this.handleApiError(error));
      })
    );
  }

  private handleApiError(error: any): Error {
    console.log('Status:', error.status);
    console.log('URL:', error.url);
    
    if (error.status === 404) {
      return new Error('URL incorrecta. Verifica el nombre del modelo.');
    } else if (error.status === 400) {
      const errorMsg = error.error?.error?.message || 'Solicitud incorrecta';
      return new Error(`Error 400: ${errorMsg}`);
    } else if (error.status === 401) {
      return new Error('API key inválida o expirada.');
    } else if (error.status === 403) {
      return new Error('Sin permisos para usar este modelo.');
    } else if (error.status === 429) {
      return new Error('Límite de uso alcanzado. Espera un momento.');
    }
    
    return new Error(`Error ${error.status}: ${error.message || 'Desconocido'}`);
  }

  // Método para probar conexión
  testConnection(): Observable<any> {
    const testBody = {
      contents: [{
        role: "user",
        parts: [{
          text: "Hola, responde con 'OK' si estás funcionando."
        }]
      }],
      generationConfig: {
        maxOutputTokens: 10
      }
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, testBody, { headers });
  }
}
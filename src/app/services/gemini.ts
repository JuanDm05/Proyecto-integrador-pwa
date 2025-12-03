import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// Eliminamos la importación de 'environment' si solo se usaba para geminiApiKey.
// Si necesitas otras variables de entorno (como las de Firebase), puedes mantenerla.
// import { environment } from '../../environments/environment.secrets'; 

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  
  // ❌ ELIMINADO: Ya no necesitamos la API Key ni la lógica para construir la URL de Google aquí.
  // private apiKey = environment.geminiApiKey; 
  
  // 🟢 CAMBIO PRINCIPAL: Apuntamos al endpoint interno de Vercel.
  private apiUrl = '/api/gemini'; 

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

    // Cambiamos el log para reflejar que se usa el proxy
    console.log('Enviando solicitud a través de Vercel API...');
    
    // El método POST ahora se dirige a tu Serverless Function (/api/gemini)
    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError(error => {
        console.error('Error al contactar el backend:', error);
        
        // Log detallado para debugging
        if (error.error) {
          console.error('Error details:', JSON.stringify(error.error, null, 2));
        }
        
        return throwError(() => this.handleApiError(error));
      })
    );
  }

  private handleApiError(error: any): Error {
    // Los códigos de error ahora provienen de tu servidor Vercel, no directamente de Google.
    console.log('Status:', error.status);
    console.log('URL:', error.url);
    
    if (error.status === 404) {
      return new Error('No se encontró el Serverless Function (/api/gemini). Verifica la ruta.');
    } else if (error.status === 500) {
      return new Error('Error interno del servidor de Vercel. (Posiblemente la API Key no está cargada correctamente en Vercel).');
    } else if (error.status === 400) {
       // Este error 400 podría ser devuelto por Vercel si Gemini lo envió primero
       const errorMsg = error.error?.error?.message || 'Solicitud incorrecta o Key inválida reportada por el proxy.';
       return new Error(`Error 400: ${errorMsg}`);
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
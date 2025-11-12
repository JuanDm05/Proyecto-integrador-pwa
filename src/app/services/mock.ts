import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockService {

  private responses = [
    "💪 Para entrenamiento de pecho: 4 series de press banca, 3 series de flexiones. ¡Enfócate en la técnica!",
    "🦵 Para piernas: Haz sentadillas 4x12, peso muerto 3x10. No olvides calentar bien.",
    "🏃‍♂️ Cardio: 30 minutos de HIIT - perfecto para quemar grasa.",
    "🍗 Nutrición: Consume 2g de proteína por kg de peso. Pollo, pescado y huevos son excelentes.",
    "🥑 Grasas saludables: Aguacate, nueces y aceite de oliva te ayudarán con la energía.",
    "💧 Hidratación: Bebe al menos 3 litros de agua al día.",
    "🔥 ¡Excelente actitud! Recuerda que la consistencia es más importante que la intensidad.",
    "🌟 Cada entrenamiento te acerca a tu versión más fuerte. ¡Sigue así!"
  ];

  sendMessage(userMessage: string): Observable<ChatResponse> {
    const lowerMessage = userMessage.toLowerCase();
    let reply = '🤔 ¿Podrías contarme más detalles sobre tu objetivo? Así puedo darte una mejor recomendación.';
    
    // Respuestas contextuales básicas
    if (lowerMessage.includes('hola') || lowerMessage.includes('hey')) {
      reply = '¡Hola! Soy tu Coach IA. ¿En qué puedo ayudarte hoy con tu entrenamiento o nutrición? 💪';
    } else if (lowerMessage.includes('ejercicio') || lowerMessage.includes('entrenar') || lowerMessage.includes('rutina')) {
      reply = this.responses[0];
    } else if (lowerMessage.includes('pierna') || lowerMessage.includes('piernas')) {
      reply = this.responses[1];
    } else if (lowerMessage.includes('cardio') || lowerMessage.includes('correr')) {
      reply = this.responses[2];
    } else if (lowerMessage.includes('comida') || lowerMessage.includes('dieta') || lowerMessage.includes('nutrición')) {
      reply = this.responses[3];
    } else if (lowerMessage.includes('agua') || lowerMessage.includes('hidratación')) {
      reply = this.responses[5];
    } else {
      // Respuesta aleatoria
      const randomIndex = Math.floor(Math.random() * this.responses.length);
      reply = this.responses[randomIndex];
    }

    // Simular delay de red (0.5-1.5 segundos)
    const delayTime = Math.random() * 1000 + 500;
    
    return of({ reply }).pipe(delay(delayTime));
  }
}
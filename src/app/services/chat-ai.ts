// chat-ai.service.ts - MEJORADO
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { GeminiService } from './gemini';
@Injectable({
  providedIn: 'root'
})
export class ChatAIService {
  // Timeout para la respuesta (10 segundos)
  private readonly TIMEOUT = 10000;

  constructor(private geminiService: GeminiService) {}

  // Método principal para enviar mensajes
  sendMessage(message: string): Observable<{ reply: string }> {
    console.log('ChatAI recibió mensaje:', message);
    
    // Usar la API de Gemini con timeout
    return this.geminiService.sendMessage(message).pipe(
      timeout(this.TIMEOUT),
     // En tu ChatAIService, modifica el map:
map((response: any) => {
  console.log('Respuesta completa:', response);
  
  if (response && response.candidates && response.candidates[0]) {
    const reply = response.candidates[0].content.parts[0].text;
    return { reply: reply.trim() };
  }
  
  // Si la estructura es diferente
  if (response && response.choices && response.choices[0]) {
    return { reply: response.choices[0].message.content.trim() };
  }
  
  throw new Error('Estructura de respuesta inesperada');
}),
      catchError(error => {
        console.warn('Usando respuesta de respaldo:', error.message);
        // Si falla la API, usar respuestas inteligentes
        return of({
          reply: this.getSmartFallbackResponse(message)
        });
      })
    );
  }

  // Formatea la respuesta
  private formatResponse(text: string): string {
    let formatted = text.trim();
    
    // Limpiar si el modelo incluye "Pregunta:" o similar
    if (formatted.includes('Pregunta:')) {
      formatted = formatted.split('Pregunta:')[0].trim();
    }
    
    // Asegurar que termine con emoji si no tiene
    const emojiRegex = /[\p{Emoji}]/gu;
    if (!emojiRegex.test(formatted)) {
      const emojis = ['💪', '🏋️‍♂️', '🔥', '🌟', '🎯', '💧', '🍎', '🥗', '✨'];
      formatted += ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }
    
    return formatted;
  }

  // Respuestas inteligentes cuando la API falla
  private getSmartFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase().trim();
    
    // Detectar categorías de fitness
    if (this.containsAny(lowerMessage, ['hola', 'buenos', 'buenas', 'hey', 'hi'])) {
      return this.getRandomResponse([
        '¡Hola! 🤗 Soy CoachFit, tu entrenador personal virtual. ¿Listo para ponerte en forma? 💪',
        '¡Hola atleta! 🏃‍♂️ ¿Qué tienes planeado para tu entrenamiento hoy?',
        '¡Buenas! 😊 Veo que estás activo. ¿En qué puedo ayudarte con tu fitness? 🏋️‍♂️'
      ]);
    }
    
    if (this.containsAny(lowerMessage, ['adiós', 'chao', 'gracias', 'bye'])) {
      return this.getRandomResponse([
        '¡Ha sido un placer! 💪 Recuerda: la consistencia es la clave del éxito.',
        '¡Nos vemos! 🏋️‍♂️ Sigue entrenando duro y come bien.',
        '¡Hasta pronto! 🌟 No olvides hidratarte y descansar bien.'
      ]);
    }
    
    if (this.containsAny(lowerMessage, ['rutina', 'ejercicio', 'entrenar', 'gym', 'pesas'])) {
      return this.getRandomResponse([
        '💪 Para una buena rutina: recomiendo 3-4 días semanales, combinando ejercicios de fuerza y cardio. ¿Eres principiante o tienes experiencia?',
        '🏋️‍♂️ El entrenamiento ideal depende de tus objetivos. ¿Quieres ganar fuerza, músculo, resistencia o perder peso?',
        '🔥 Lo esencial: Calentamiento (5-10 min), entrenamiento principal (45-60 min), enfriamiento (5-10 min). ¿Necesitas una rutina específica?'
      ]);
    }
    
    if (this.containsAny(lowerMessage, ['comida', 'dieta', 'nutrición', 'proteína', 'carbohidratos', 'grasas'])) {
      return this.getRandomResponse([
        '🍎 Nutrición clave: Consume suficiente proteína (1.6-2.2g por kg de peso), carbohidratos complejos para energía y grasas saludables.',
        '🥗 ¿Tu objetivo nutricional principal? Puedo ayudarte con planes para perder grasa, ganar músculo o mantener peso.',
        '💧 Hidratación: Bebe al menos 35ml por kg de peso al día. Si entrenas intenso, aumenta a 40-45ml.'
      ]);
    }
    
    if (this.containsAny(lowerMessage, ['perder peso', 'adelgazar', 'bajar', 'grasa'])) {
      return this.getRandomResponse([
        '🎯 Para perder peso de forma saludable: Déficit calórico moderado (300-500 kcal) + entrenamiento de fuerza + cardio.',
        '🔥 Pérdida sostenible: Apunta a 0.5-1kg por semana. Más rápido puede hacerte perder músculo.',
        '🍃 Combina alimentación balanceada con ejercicio regular y buen descanso. ¡La paciencia da resultados!'
      ]);
    }
    
    if (this.containsAny(lowerMessage, ['ganar músculo', 'volumen', 'masa', 'hipertrofia'])) {
      return this.getRandomResponse([
        '💪 Para ganar músculo: Superávit calórico (200-500 kcal) + proteína abundante + entrenamiento progresivo en pesas.',
        '🏋️‍♂️ Enfoquémonos en ejercicios compuestos: sentadillas, press banca, peso muerto, dominadas y press militar.',
        '🌟 Progresión: Aumenta el peso, repeticiones o series cada 1-2 semanas para seguir progresando.'
      ]);
    }
    
    if (this.containsAny(lowerMessage, ['casa', 'hogar', 'sin equipo', 'sin gimnasio'])) {
      return this.getRandomResponse([
        '🏠 Rutina en casa: Sentadillas, flexiones, planchas, fondos en silla, zancadas y burpees.',
        '💪 Entrenamiento con peso corporal: 3-4 series de cada ejercicio, descanso 45-60 segundos entre series.',
        '🎯 20-30 minutos diarios en casa pueden transformar tu físico. ¡La consistencia es más importante que la intensidad!'
      ]);
    }
    
    if (this.containsAny(lowerMessage, ['motivación', 'ánimo', 'desanimado', 'perder la motivación'])) {
      return this.getRandomResponse([
        '🔥 ¡Tú puedes hacerlo! Cada entrenamiento te acerca a tu mejor versión.',
        '💪 La disciplina siempre vence a la motivación. Hazlo incluso cuando no tengas ganas.',
        '🌟 Recuerda tu "por qué". Visualiza tus metas y celebra cada pequeño progreso.'
      ]);
    }
    
    if (this.containsAny(lowerMessage, ['descanso', 'dormir', 'recuperación'])) {
      return this.getRandomResponse([
        '😴 Descanso crucial: 7-9 horas de sueño para óptima recuperación muscular.',
        '💤 Los músculos crecen cuando descansas, no cuando entrenas. No subestimes el sueño.',
        '✨ Días de descanso activo: Caminata ligera, estiramientos suaves o yoga.'
      ]);
    }
    
    // Respuesta por defecto para temas fitness no específicos
    return this.getRandomResponse([
      '¡Interesante pregunta! 💭 Como coach, te diría que lo más importante es la constancia y la técnica adecuada.',
      '🤔 En fitness, cada cuerpo es diferente. Lo que funciona para otros puede no funcionar para ti. ¿Podrías darme más detalles?',
      '💪 Me encanta tu curiosidad por el fitness. ¿Te gustaría que profundice en algún aspecto específico?',
      '🏋️‍♂️ Como entrenador, mi consejo general es: escucha a tu cuerpo, come bien, entrena inteligente y sé paciente.'
    ]);
  }

  // Helper para verificar palabras clave
  private containsAny(text: string, words: string[]): boolean {
    return words.some(word => text.includes(word));
  }

  // Helper para respuesta aleatoria
  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
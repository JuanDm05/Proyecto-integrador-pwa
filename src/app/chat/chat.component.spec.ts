import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing'; // Importar fakeAsync y tick
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ChatComponent } from './chat.component'; 
import { ChatAIService } from '../services/chat-ai'; 

describe('ChatComponent (Integración con ChatAIService y DOM)', () => {
  let fixture: ComponentFixture<ChatComponent>;
  let component: ChatComponent;
  let chatAIServiceMock: any;

  const USER_MESSAGE = 'Quiero una rutina para pecho.';
  const BOT_RESPONSE = { reply: 'Claro, aquí tienes una rutina de pecho de 3 ejercicios.' };

  beforeEach(async () => {
    chatAIServiceMock = jasmine.createSpyObj('ChatAIService', ['sendMessage']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ChatComponent 
      ],
      providers: [
        { provide: ChatAIService, useValue: chatAIServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });
  
  // --- PRUEBAS ESTABLES Y CORREGIDAS ---

  it('debería inicializar con un mensaje de bienvenida del bot', () => {
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].sender).toBe('bot');
  });

  // CORREGIDO: Ajustamos las aserciones para el comportamiento síncrono de 'of()'
  it('debería enviar el mensaje del usuario y llamar al servicio', () => {
    chatAIServiceMock.sendMessage.and.returnValue(of(BOT_RESPONSE));

    component.userMessage = USER_MESSAGE;
    fixture.detectChanges(); 
    
    const sendButton = fixture.debugElement.query(By.css('.send-button')).nativeElement;
    sendButton.click();

    // 1. Verificar la interacción con el servicio
    expect(chatAIServiceMock.sendMessage).toHaveBeenCalledWith(USER_MESSAGE);
    
    // 2. CORRECCIÓN: Como 'of()' resuelve inmediatamente (síncronamente), 
    // el mensaje del bot ya se agregó y 'isTyping' ya se desactivó.
    expect(component.messages.length).toBe(3); // Bienvenida + Usuario + Bot
    expect(component.isTyping).toBeFalse();   // Ya terminó de 'escribir'
    expect(component.userMessage).toBe('');   // Se vació el input
  });

  // CORREGIDO: Usamos fakeAsync para la prueba de DOM
  it('debería mostrar la respuesta del bot en el DOM después de una llamada exitosa', fakeAsync(() => {
    chatAIServiceMock.sendMessage.and.returnValue(of(BOT_RESPONSE));
    
    component.userMessage = USER_MESSAGE;
    component.sendMessage(); 

    // tick(0) para resolver el setTimeout interno del scroll
    tick(100); 
    
    fixture.detectChanges(); 

    // 1. Verificar el estado
    expect(component.isTyping).toBeFalse(); 
    expect(component.messages.length).toBe(3); 
    
    // 2. Verificar el DOM
    const botBubbles = fixture.debugElement.queryAll(By.css('.message.bot .bubble'));
    expect(botBubbles.length).toBe(2); // Bienvenida + Respuesta
    expect(botBubbles[1].nativeElement.textContent).toContain(BOT_RESPONSE.reply);
  }));

  // CORREGIDO: Usamos fakeAsync para la prueba de DOM
  it('debería mostrar un mensaje de error del bot en caso de fallo del servicio', fakeAsync(() => {
    // throwError necesita ser llamado con una función de flecha para la compatibilidad con RxJS 7+
    chatAIServiceMock.sendMessage.and.returnValue(throwError(() => new Error('API Error')));
    
    component.userMessage = USER_MESSAGE;
    component.sendMessage();
    
    // tick(0) para resolver el setTimeout interno del scroll
    tick(100); 
    
    fixture.detectChanges(); 

    // 1. Verificar el estado
    expect(component.isTyping).toBeFalse(); 
    expect(component.messages.length).toBe(3); // Bienvenida + Usuario + Mensaje de Error
    
    // 2. Verificar el DOM
    const botBubbles = fixture.debugElement.queryAll(By.css('.message.bot .bubble'));
    expect(botBubbles.length).toBe(2);
    expect(botBubbles[1].nativeElement.textContent).toContain('¡Ups! Tuve un pequeño problema.');
  }));
  
  // CORREGIDO: Usamos fakeAsync y tick() para controlar los setTimeout de quickQuestion
  it('quickQuestion() debería rellenar el input y llamar a sendMessage', fakeAsync(() => {
    chatAIServiceMock.sendMessage.and.returnValue(of(BOT_RESPONSE));
    const quickQ = '¿Ejercicios en casa sin equipo?';
    
    // 1. Act: Llamar al método de acción rápida
    component.quickQuestion(quickQ);
    
    // 2. Mover el tiempo para ejecutar el primer setTimeout (50ms)
    tick(50);
    
    // 3. Assert (Interacción): Verificar que el servicio fue llamado
    expect(chatAIServiceMock.sendMessage).toHaveBeenCalledWith(quickQ);
    
    // 4. Mover el tiempo para ejecutar el segundo setTimeout (100ms), que pone el foco
    tick(100);
    
    // 5. Assert (Estado): Verificar que el input se vació después de la llamada a sendMessage
    expect(component.userMessage).toBe(''); 
    
    // 6. Verificar el DOM si es necesario (el mensaje del bot y del usuario ya están allí)
    expect(component.messages.length).toBe(3); // Ya se ejecutó sendMessage y recibió respuesta
  }));
});
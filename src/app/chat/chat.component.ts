import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatAIService } from '../services/chat-ai';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="chat-app">
      <!-- Header -->
      <header class="chat-header">
        <div class="header-content">
          <button class="back-button" routerLink="/home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <h1 class="title-logo">🤖 CoachFit AI</h1>
          <div class="ai-status">
            <span class="status-dot" [class.active]="!isTyping"></span>
            <span class="status-text">{{ isTyping ? 'Escribiendo...' : 'En línea' }}</span>
          </div>
        </div>
      </header>

      <!-- Chat Area -->
      <main class="chat-content">
        <div class="chat-box" #chatContainer>
          <!-- Welcome Message -->
          <div class="welcome-message">
            <div class="welcome-icon">💪</div>
            <div class="welcome-content">
              <h3>CoachFit AI - Tu Entrenador Personal</h3>
              <p>Pregúntame sobre entrenamiento, nutrición, rutinas o motivación. ¡Estoy aquí para ayudarte a alcanzar tus metas fitness!</p>
              <div class="welcome-tags">
                <span class="tag">🏋️‍♂️ Fuerza</span>
                <span class="tag">🍎 Nutrición</span>
                <span class="tag">🏠 Casa</span>
                <span class="tag">💪 Motivación</span>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div *ngFor="let msg of messages" class="message" [class.user]="msg.sender === 'user'" [class.bot]="msg.sender === 'bot'">
            <div class="avatar">
              {{ msg.sender === 'user' ? '💪' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="bubble">{{ msg.text }}</div>
              <div class="time">{{ msg.time }}</div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div *ngIf="isTyping" class="message bot typing">
            <div class="avatar">🤖</div>
            <div class="message-content">
              <div class="typing-bubble">
                <div class="typing-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Input Area -->
      <footer class="chat-footer">
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button class="quick-btn" (click)="quickQuestion('¿Qué rutina para principiantes?')">
            🏋️‍♂️ Principiante
          </button>
          <button class="quick-btn" (click)="quickQuestion('¿Cómo perder grasa abdominal?')">
            🍎 Perder Peso
          </button>
          <button class="quick-btn" (click)="quickQuestion('¿Ejercicios en casa sin equipo?')">
            🏠 En Casa
          </button>
          <button class="quick-btn" (click)="quickQuestion('¿Qué comer después de entrenar?')">
            🥗 Nutrición
          </button>
        </div>

        <!-- Input Field -->
        <div class="input-area">
          <div class="input-wrapper">
            <textarea 
              [(ngModel)]="userMessage"
              placeholder="Escribe tu pregunta sobre fitness aquí..."
              (keydown.enter)="onEnterPress($event)"
              [disabled]="isTyping"
              rows="1"
              #messageInput
            ></textarea>
            <div class="input-hint" *ngIf="!userMessage">
              Ej: "¿Rutina para brazos?", "¿Qué comer para ganar músculo?"
            </div>
          </div>
          <button 
            class="send-button" 
            (click)="sendMessage()"
            [disabled]="!userMessage.trim() || isTyping"
            [class.sending]="isTyping"
          >
            <span *ngIf="!isTyping">Enviar</span>
            <div *ngIf="isTyping" class="spinner"></div>
          </button>
        </div>

        <!-- Disclaimer -->
        <div class="disclaimer">
          ⚠️ CoachFit AI es un asistente educativo. Para planes personalizados consulta a un profesional.
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .chat-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: #f7fbf7;
    }

    /* Header */
    .chat-header {
      background: linear-gradient(135deg, #4f9d60 0%, #3a7547 100%);
      padding: 15px 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .back-button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      transition: all 0.3s;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .title-logo {
      flex: 1;
      color: white;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ai-status {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      font-size: 14px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #ff6b6b;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-dot.active {
      background: #51cf66;
      animation: none;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Chat Content */
    .chat-content {
      flex: 1;
      overflow: hidden;
      background: linear-gradient(180deg, #f8fdf8 0%, #ffffff 100%);
    }

    .chat-box {
      height: 100%;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Welcome Message */
    .welcome-message {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border-radius: 20px;
      padding: 25px;
      color: white;
      margin-bottom: 10px;
      animation: slideIn 0.5s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .welcome-icon {
      font-size: 40px;
      margin-bottom: 15px;
    }

    .welcome-content h3 {
      margin: 0 0 10px 0;
      font-size: 18px;
    }

    .welcome-content p {
      margin: 0 0 15px 0;
      opacity: 0.95;
      line-height: 1.5;
    }

    .welcome-tags {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .tag {
      background: rgba(255, 255, 255, 0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    /* Messages */
    .message {
      display: flex;
      gap: 12px;
      max-width: 85%;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message.bot {
      align-self: flex-start;
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
      color: white;
    }

    .user .avatar {
      background: linear-gradient(135deg, #36c86c 0%, #2eb85c 100%);
    }

    .message-content {
      display: flex;
      flex-direction: column;
    }

    .user .message-content {
      align-items: flex-end;
    }

    .bubble {
      padding: 16px 20px;
      border-radius: 20px;
      font-size: 16px;
      line-height: 1.5;
      word-wrap: break-word;
      max-width: 100%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .bot .bubble {
      background: white;
      color: #333;
      border-top-left-radius: 6px;
      border: 1px solid #e8f5e9;
    }

    .user .bubble {
      background: linear-gradient(135deg, #36c86c 0%, #2eb85c 100%);
      color: white;
      border-top-right-radius: 6px;
    }

    .time {
      font-size: 12px;
      color: #777;
      margin-top: 6px;
      padding: 0 4px;
    }

    .user .time {
      color: #4f9d60;
      text-align: right;
    }

    /* Typing Indicator */
    .typing .typing-bubble {
      background: white;
      border: 1px solid #e8f5e9;
      border-radius: 20px;
      padding: 16px 20px;
      border-top-left-radius: 6px;
    }

    .typing-dots {
      display: flex;
      gap: 6px;
    }

    .typing-dots div {
      width: 8px;
      height: 8px;
      background: #4f9d60;
      border-radius: 50%;
      animation: typingDot 1.4s infinite;
    }

    .typing-dots div:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots div:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingDot {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    /* Footer */
    .chat-footer {
      background: white;
      border-top: 1px solid #e8f5e9;
      padding: 15px 20px;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
    }

    .quick-actions {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .quick-btn {
      background: #f0f9f0;
      border: 1px solid #c8e6c9;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 14px;
      color: #2e7d32;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .quick-btn:hover {
      background: #e8f5e9;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(79, 157, 96, 0.1);
    }

    .input-area {
      display: flex;
      gap: 12px;
      margin-bottom: 10px;
    }

    .input-wrapper {
      flex: 1;
      position: relative;
    }

    textarea {
      width: 100%;
      border: 2px solid #e8f5e9;
      border-radius: 20px;
      padding: 14px 20px;
      font-size: 16px;
      font-family: inherit;
      resize: none;
      min-height: 52px;
      max-height: 120px;
      background: white;
      color: #333;
      transition: all 0.3s;
    }

    textarea:focus {
      outline: none;
      border-color: #4f9d60;
      box-shadow: 0 0 0 3px rgba(79, 157, 96, 0.1);
    }

    textarea:disabled {
      background: #f5f5f5;
      cursor: not-allowed;
    }

    .input-hint {
      font-size: 12px;
      color: #777;
      padding: 6px 20px 0;
      font-style: italic;
    }

    .send-button {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border: none;
      border-radius: 20px;
      padding: 0 28px;
      color: white;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      min-width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 52px;
    }

    .send-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79, 157, 96, 0.2);
    }

    .send-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .send-button.sending {
      background: linear-gradient(135deg, #6bb77b 0%, #8bc98c 100%);
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .disclaimer {
      text-align: center;
      color: #777;
      font-size: 11px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #e8f5e9;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .chat-header {
        padding: 12px 15px;
      }
      
      .title-logo {
        font-size: 16px;
      }
      
      .chat-box {
        padding: 15px;
      }
      
      .welcome-message {
        padding: 20px;
      }
      
      .message {
        max-width: 90%;
      }
      
      .quick-actions {
        justify-content: flex-start;
        overflow-x: auto;
        padding-bottom: 5px;
      }
      
      .quick-btn {
        white-space: nowrap;
        font-size: 13px;
        padding: 6px 12px;
      }
      
      .input-area {
        flex-direction: column;
      }
      
      .send-button {
        width: 100%;
        margin-top: 10px;
      }
    }

    /* Scrollbar */
    .chat-box::-webkit-scrollbar {
      width: 6px;
    }

    .chat-box::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .chat-box::-webkit-scrollbar-thumb {
      background: #c8e6c9;
      border-radius: 3px;
    }

    .chat-box::-webkit-scrollbar-thumb:hover {
      background: #4f9d60;
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;

  userMessage = '';
  messages: any[] = [];
  isTyping = false;

  constructor(private chatAI: ChatAIService) {}

  ngOnInit() {
    // Mensaje de bienvenida inicial
    this.addBotMessage('¡Hola! Soy CoachFit, tu entrenador personal virtual. 🤖\n\n¿En qué puedo ayudarte hoy? Puedes preguntarme sobre:\n• Rutinas de entrenamiento 💪\n• Consejos de nutrición 🍎\n• Ejercicios específicos 🏋️‍♂️\n• Motivación y tips 🌟');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

 // En el método sendMessage() del componente:
sendMessage() {
  const text = this.userMessage.trim();
  if (!text) return;

  // Agregar mensaje del usuario
  this.addUserMessage(text);
  this.userMessage = '';
  this.isTyping = true;

  // Resetear el textarea height
  this.messageInput.nativeElement.style.height = 'auto';

  // Enviar a la IA
  this.chatAI.sendMessage(text).subscribe({
    next: (response) => {
      this.isTyping = false;
      this.addBotMessage(response.reply);
      // Enfocar el input después de recibir respuesta
      setTimeout(() => {
        this.messageInput.nativeElement.focus();
      }, 100);
    },
    error: (error) => {
      console.error('Error en el chat:', error);
      this.isTyping = false;
      this.addBotMessage('¡Ups! Parece que hay un problema temporal. Mientras tanto, recuerda: ¡La constancia en el entrenamiento y la alimentación balanceada son tus mejores aliados! 💪\n\n¿Hay algo más específico sobre fitness que te gustaría saber?');
      this.messageInput.nativeElement.focus();
    }
  });
}
  quickQuestion(question: string) {
    this.userMessage = question;
    setTimeout(() => {
      this.sendMessage();
      // Enfocar el input después de enviar
      setTimeout(() => {
        this.messageInput.nativeElement.focus();
      }, 100);
    }, 50);
  }

 onEnterPress(event: Event) {
  const keyboardEvent = event as KeyboardEvent;
  
  if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
    keyboardEvent.preventDefault();
    this.sendMessage();
  }
}

  private addUserMessage(text: string) {
    this.messages.push({
      text: text,
      sender: 'user',
      time: this.getCurrentTime()
    });
    this.scrollToBottom();
  }

  private addBotMessage(text: string) {
    this.messages.push({
      text: text,
      sender: 'bot',
      time: this.getCurrentTime()
    });
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer && this.chatContainer.nativeElement) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  private getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}
import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockService } from '../services/mock';

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
          <h1 class="title-logo">CoachChatbot</h1>
        </div>
      </header>

      <!-- Content -->
      <main class="chat-content">
        <div class="chat-bg"></div>

        <div #chatContainer class="chat-box">
          <div *ngFor="let m of messages" [ngClass]="m.from" class="msg">
            <div class="msg-avatar" *ngIf="m.from==='bot'">🤖</div>
            <div class="msg-text">
              <p>{{ m.text }}</p>
            </div>
            <div class="msg-avatar" *ngIf="m.from==='user'">🏋️‍♂️</div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="chat-footer">
        <div class="footer-toolbar">
          <div class="input-area">
            <textarea
              [(ngModel)]="text"
              placeholder="💬 Escribe tu mensaje..."
              class="chat-input"
              (keydown)="onKeyPress($event)"
              rows="1"
              #textInput
            ></textarea>
            <button
              class="send-btn"
              (click)="send()"
              [disabled]="!text.trim()"
            >
              Enviar
            </button>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .chat-app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: linear-gradient(180deg, rgba(232, 246, 255, 0.3) 0%, #ffffff 100%);
    }

    .chat-header {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      box-shadow: 0 2px 12px rgba(79, 157, 96, 0.2);
      position: relative;
      z-index: 10;
    }

    .header-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
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
      transition: all 0.3s ease;
      margin-right: 12px;
    }

    .title-logo {
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #ffffff;
      font-size: 18px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      margin: 0;
    }

    .chat-content {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-bg {
      background-size: cover;
      background-position: center;
      opacity: 0.03;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 0;
      pointer-events: none;
    }

    .chat-box {
      position: relative;
      z-index: 1;
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px 16px;
    }

    .msg {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      max-width: 90%;
      margin: 10px 0;
    }

    .user {
      justify-content: flex-end;
      margin-left: auto;
    }

    .msg-text {
      background: #fff;
      padding: 16px 18px;
      border-radius: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      font-size: 17px;
      line-height: 1.6;
      color: #222;
      word-wrap: break-word;
      font-weight: 500;
    }

    .bot .msg-text {
      background: linear-gradient(145deg, #f8fafb 0%, #f1f5f9 100%);
      color: #333;
      border-top-left-radius: 6px;
    }

    .user .msg-text {
      background: linear-gradient(135deg, #36c86c 0%, #2eb85c 100%);
      color: white;
      border-top-right-radius: 6px;
    }

    .msg-avatar {
      font-size: 28px;
      line-height: 1;
      user-select: none;
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .bot .msg-avatar {
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      order: -1;
    }

    .user .msg-avatar {
      background: linear-gradient(135deg, #36c86c 0%, #2eb85c 100%);
    }

    .chat-footer {
      margin-top: auto;
    }

    .footer-toolbar {
      background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
      padding: 16px 20px;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    }

    .input-area {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
    }

    .chat-input {
      flex: 1;
      border-radius: 26px;
      background: white;
      padding: 14px 20px;
      font-size: 17px;
      font-weight: 500;
      color: #222;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border: 2px solid rgba(79, 157, 96, 0.1);
      transition: all 0.3s ease;
      min-height: 48px;
      font-family: inherit;
      resize: none;
    }

    .send-btn {
      border-radius: 24px;
      background: linear-gradient(135deg, #4f9d60 0%, #6bb77b 100%);
      border: none;
      font-weight: 700;
      font-size: 17px;
      height: 56px;
      min-width: 110px;
      box-shadow: 0 4px 16px rgba(79, 157, 96, 0.15);
      transition: all 0.3s ease;
      color: white;
      cursor: pointer;
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  @ViewChild('textInput') private textInput!: ElementRef;

  text = '';
  messages: { from: 'user' | 'bot'; text: string }[] = [];
  
  constructor(private mock: MockService) {}
  
  ngOnInit() {
    this.messages.push({ 
      from: 'bot', 
      text: '¡Hola! Soy tu Coach IA. ¿Qué tienes planeado entrenar hoy o qué quieres saber sobre nutrición?'
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  send() {
    if (!this.text.trim()) return;

    const userText = this.text;
    this.messages.push({ from: 'user', text: userText });
    this.text = '';
    this.scrollToBottom();

    this.mock.sendMessage(userText).subscribe(resp => {
      this.messages.push({ from: 'bot', text: resp.reply });
      this.scrollToBottom();
    });
  }
  
  scrollToBottom() {
    try {
      setTimeout(() => {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }
      }, 100);
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
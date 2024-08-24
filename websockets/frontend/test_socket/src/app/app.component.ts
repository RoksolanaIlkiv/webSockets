import { Component } from '@angular/core';
import { WebSocketWithSubjectService } from './web-socket-with-subject.service';
import { WebSocketService } from './web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  messages: string[] = [];
  inputValue: string = '';

  constructor(
   // private webSocketService: WebSocketService,
    private webSocketService: WebSocketWithSubjectService
  ) 
  {
    this.webSocketService.messages$.subscribe((mes) => {
      this.messages = [...this.messages, mes];
    });
  }

  send() {
    this.webSocketService.send(this.inputValue);
    this.inputValue = '';
  }

  connect() {
    this.webSocketService.connect();
  }

  clear() {
    this.messages = [];
  }

  disconnect() {
    this.webSocketService.disconnect();
  }
}

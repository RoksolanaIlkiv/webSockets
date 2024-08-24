import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  isConnected = false;
  interval: ReturnType<typeof setInterval> | null = null;
  messages$ = new Subject<string>();

  constructor() {}

  connect() {
    let comp = this;
    this.socket = new WebSocket(
      // 'wss://echo.websocket.org'
      'ws://localhost:8080'
    );

    this.socket.onopen = () => {
      comp.isConnected = true;
      comp.heartbeat();
      alert('Connected!');
    };

    this.socket.onclose = () => {
      comp.isConnected = false;
      alert('Disconnected!');
    };

    this.socket.onmessage = (mes) => {
      // console.log('onmessage', mes);
      const message = mes.data.toString();
      if (message && message !== 'ping') {
        this.messages$.next(message);
      }
    };

    this.socket.onerror = () => {
      comp.isConnected = false;
      alert('Error occurs!');
    };
  }

  send(msg: string) {
    if (this.isConnected) {
      this.socket?.send(msg);
    } else {
      if (this.interval) clearInterval(this.interval);
      alert('Please connect first!');
    }
  }

  disconnect() {
    this.socket?.close();
    if (this.interval) clearInterval(this.interval);
  }

  heartbeat() {
    if (!this.socket) return;
    if (this.socket.readyState !== 1) return;

    this.interval = setInterval(() => {
      // console.log('onping');
      this.send('ping');
    }, 5000);
  }
}

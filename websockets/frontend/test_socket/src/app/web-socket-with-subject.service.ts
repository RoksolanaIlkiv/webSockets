import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketWithSubjectService {
  private subject!: WebSocketSubject<any>;
  isConnected = false;
  interval: ReturnType<typeof setInterval> | null = null;
  messages$ = new Subject<string>();

  constructor() {}

  connect() {
    let comp = this;
    this.subject = webSocket({
      // url: "wss://echo.websocket.org",
      url: 'ws://localhost:8080',
      deserializer: (e) => e,
      openObserver: {
        next: () => {
          comp.isConnected = true;
          comp.heartbeat();
          alert('Connected!');
        },
      },
      closeObserver: {
        next: () => {
          comp.isConnected = false;
          alert('Disconnected!');
        },
      },
    });

    this.subject.subscribe({
      next: (res) => {
        //  console.log('onmessage', res);
        this.isConnected = true;
        const message = JSON.parse(res.data);
        if (message && message !== 'ping') {
          this.messages$.next(message);
        }
      },
      error: () => {
        this.isConnected = false;
        alert('Error occurs!');
      },
      complete: () => {
        // console.log('completed');
      },
    });
  }

  send(msg: string) {
    if (this.isConnected) {
      this.subject.next(msg);
    } else {
      if (this.interval) clearInterval(this.interval);
      alert('Please connect first!');
    }
  }

  disconnect() {
    this.subject?.complete();
    if (this.interval) clearInterval(this.interval);
  }

  heartbeat() {
    this.interval = setInterval(() => {
      // console.log('onping');
      this.send('ping');
    }, 5000);
  }
}

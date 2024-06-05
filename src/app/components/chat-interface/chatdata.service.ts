import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: any;

  constructor() {
    this.socket = io('http://localhost:5000');
  }

  sendMessage(message: any): void {
    this.socket.emit('chatMessage', message);
  }

  receiveMessage(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('receivedMsg', (message: string) => {
        observer.next(message);
      });
    });
  }

}
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: any;

  constructor() {
    this.socket = io(env.apiHostName);
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
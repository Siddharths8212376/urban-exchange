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

  joinRoom(chatId: any, userid : any): void {
    this.socket.emit('createConnection', userid);
}

sendMessage(message: any, senderId: any, receiverId: any): void {
    this.socket.emit('chatMessage', { message, senderId ,receiverId });
}

receiveMessage(chatId: any): Observable<string> {
  return new Observable<string>(observer => {
      this.socket.on('receivedMsg', (message: string) => {
          observer.next(message);
      });
  });
}
}
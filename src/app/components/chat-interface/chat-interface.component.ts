import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/authentication/auth.service';
import { ChatService } from './chatdata.service';
import { User } from 'src/app/models/user.model';
interface Message {
  sender: string | undefined;
  messageText: string;
  receiver: string | undefined;
}
@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss'],
})
export class ChatInterfaceComponent {
  constructor(
    public ProductService: ProductService,
    private ChatService: ChatService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // take input mat dialog data
  @ViewChild('chatEnd', { read: ElementRef, static: false }) chatEnd!: ElementRef;
  currentUser = this.authService.getCurrentUser()
    ? this.authService.getCurrentUser()
    : '';

  chatData: any;
  userData!: User;
  userName = '';

  messages: Message[] = [];
  newMessage = '';
  ngOnInit() {
    this.chatData = this.data.chatData;
    this.authService.getUserDetails().subscribe((user: any) => {
      this.userData = user.data;

      this.userName = user.data.firstName
        ? user.data.firstName
        : user.data.email.split('@')[0];
    });
    let chatid = this.chatData._id;
    this.ChatService.receiveMessage().subscribe((message: any) => {
      if (
        this.messages.length !== 0 &&
        this.messages[this.messages.length - 1]['messageText'] !== message.messageText &&
        this.messages[this.messages.length - 1]['sender'] !== message.sender
      ) {
        this.messages.push(message);
        this.scrollToChatEnd();
      }
    });
    if (this.messages.length == 0) {
      this.ProductService.getChat(chatid).subscribe((message: any) => {
        if (message.messages && message.messages.length > 0) {
          this.messages = message.messages;
          this.scrollToChatEnd();
        }
      });
    }
  }

  sendMessage() {
    let newMsg: Message = {
      sender: this.userData?._id,
      messageText: this.newMessage,
      receiver: this.chatData.seller == this.userData?._id ? this.chatData.buyer : this.chatData.seller,
    };
    this.ChatService.sendMessage(newMsg);
    this.messages.push(newMsg);

    this.ProductService.updateChat(
      this.data.chatData._id,
      this.messages
    ).subscribe((message: any) => {
    });
    this.newMessage = '';
    this.scrollToChatEnd();
  }

  //function to return 'right' or 'left' based on the sender of the message
  getAlignment(sender: string | undefined) {
    return sender == this.userData._id ? 'right' : 'left';
  }

  getAlignmentBubble(sender: string | undefined) {
    return sender == this.userData._id ? 'rightBubble' : 'leftBubble';
  }
  scrollToChatEnd() {
    setTimeout(() => this.chatEnd.nativeElement.scrollIntoView({ behavior: 'smooth', block: "end" }), 100);
  }
}

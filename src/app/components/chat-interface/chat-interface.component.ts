import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/authentication/auth.service';
import { ChatService } from './chatdata.service';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { defaultUser } from 'src/app/constants/user.constant';
interface Message {
  sender: string | undefined;
  messageText: string;
  receiver: string | undefined;
  postedTime: Date;
}
@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss'],
})
export class ChatInterfaceComponent {
  constructor(
    public ProductService: ProductService,
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
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
  partner: User = defaultUser;
  messages: Message[] = [];
  newMessage = '';
  isPartnerOnline: boolean = false;
  ngOnInit() {
    this.chatData = this.data.chatData;
    this.partner._id = this.data.partner;
    this.userService.receiveNotif().subscribe(response => {
      if (response.user._id == this.partner._id) {
        if (response.status == "online") {
          this.isPartnerOnline = true;
          this.partner.lastActive = new Date();
        } else if (response.status == "offline") {
          this.isPartnerOnline = false;
        }
      }
    })
    this.userService.userDetails(this.partner).subscribe(response => {
      this.partner = response;
    })
    this.authService.getUserDetails().subscribe((user: any) => {
      this.userData = user.data;

      this.userName = user.data.firstName
        ? user.data.firstName
        : user.data.email.split('@')[0];
    });
    let chatid = this.chatData._id;
    this.chatService.receiveMessage().subscribe((message: any) => {
      if (
        this.messages.length !== 0 &&
        this.messages[this.messages.length - 1]['messageText'] !== message.messageText
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
      postedTime: new Date(),
    };
    this.chatService.sendMessage(newMsg);
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

  getAlignmentBubble(sender: string | undefined, index: number): string {
    if (index > 0 && this.messages[index - 1].sender == sender) {
      // same bubble so equal borders
      return sender == this.userData._id ? 'rightBubble-equal' : 'leftBubble-equal';
    } else if (index > 0 && this.messages[index - 1].sender !== sender) {
      return sender == this.userData._id ? 'rightBubble-top' : 'leftBubble-top';
    }
    return sender == this.userData._id ? 'rightBubble' : 'leftBubble';
  }
  isUserOnline(): boolean {
    if (this.partner.lastActive) {
      if ((Date.now() - new Date(this.partner.lastActive).getTime()) <= 120_000) {
        this.isPartnerOnline = true;
        return true;
      }
    }
    this.isPartnerOnline = false;
    return false;
  }
  isDateBreak(i: number): boolean {
    if (this.messages[i].postedTime && this.messages[i - 1].postedTime) {
      return new Date(this.messages[i].postedTime).getDate() - new Date(this.messages[i - 1].postedTime).getDate() > 0;
    }
    return false;
  }
  scrollToChatEnd() {
    setTimeout(() => this.chatEnd.nativeElement.scrollIntoView({ behavior: 'smooth', block: "end" }), 100);
  }
}

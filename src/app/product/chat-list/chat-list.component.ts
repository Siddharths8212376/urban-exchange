import { Component } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { Message } from 'src/app/models/Message.model';
import { Chat } from 'src/app/models/chat.model';
import { User } from 'src/app/models/user.model';
import { DataService } from 'src/app/services/data/data.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { ChatInterfaceComponent } from '../chat-interface/chat-interface.component';
import { ChatService } from '../chat-interface/chatdata.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
})
export class ChatListComponent {
  chats: Chat[] = [];
  currentChat!: Chat;
  constructor(
    private userService: UserService,
    private dataService: DataService,
    private ProductService: ProductService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private authService: AuthService,
    private chatService: ChatService,
  ) { }
  currentUser: User = this.authService.getCurrentUser();

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.ProductService.getChatsForProduct(params['id']).subscribe(
          (response: any) => {
            this.chats = response;
            this.setPartnerInfo();
          }
        );
      } else if (params['pid']) {
        this.ProductService.getChatsForUser(params['pid']).subscribe(
          (response: any) => {
            this.chats = response;
            this.setPartnerInfo();
          }
        );
      }
    });
    this.chatService.receiveMessage().subscribe((message: any) => {
      let chat = this.chats.find(chat => chat._id == message._id);
      if (chat) {
        chat.lastMessage = message.messageText;
        if (this.currentChat && chat._id !== this.currentChat._id || !this.currentChat) {
          chat.unreadBy = message.receiver;
          chat.unread++;
          this.ProductService.updateUnread({ _id: chat._id, unread: chat.unread, unreadBy: chat.unreadBy }).subscribe(response => { });
          this.dataService.setUnreadMessages(this.dataService.unreadMessages$.value + 1);
        }
      }

    });
  }
  setPartnerInfo() {
    this.chats.forEach(chat => {
      chat.partner = (this.currentUser as User)._id == chat.buyer ? chat.sellerInfo : chat.buyerInfo;
      chat.lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].messageText : '';
    })
  }
  openChat(chat: Chat) {
    const dialogRef = this.dialog.open(ChatInterfaceComponent, {
      width: '30%',
      height: '70%',
      minWidth: '40rem',
      data: {
        chatData: chat,
        partner: chat.buyer,
      },
    });
  }
  displayChat(chat: Chat) {
    this.currentChat = chat;
  }
  isMessagePosted($event: { message: Message, chatId: string }) {
    if (this.currentChat._id == $event.chatId) {
      this.currentChat.messages.push($event.message);
    }
  }
}

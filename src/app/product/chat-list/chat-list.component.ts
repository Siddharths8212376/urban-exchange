import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Chat } from 'src/app/models/chat.model';
import { DataService } from 'src/app/services/data/data.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { ChatInterfaceComponent } from '../chat-interface/chat-interface.component';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/authentication/auth.service';
import { Message } from 'src/app/models/Message.model';

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
    private fb: FormBuilder,
    private UserService: UserService,
    private dataService: DataService,
    private ProductService: ProductService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private authService: AuthService,
  ) { }
  currentUser = this.authService.getCurrentUser()
    ? this.authService.getCurrentUser()
    : '';

  ngOnInit(): void {
    // get id from route
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
  }
  setPartnerInfo() {
    this.chats.forEach(chat => {
      chat.partner = (this.currentUser as User)._id == chat.buyer ? chat.sellerInfo : chat.buyerInfo;
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
      }, // Pass the seller data to your dialog component
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

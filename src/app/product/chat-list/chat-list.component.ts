import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { DataService } from 'src/app/services/data/data.service';
import { ProductService } from 'src/app/services/product/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ChatInterfaceComponent } from '../../components/chat-interface/chat-interface.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent {

  chats: any = [];

  constructor(private fb: FormBuilder,
    private UserService: UserService,
    private dataService: DataService,
    private ProductService: ProductService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
  }


  ngOnInit(): void {

    // get id from route
    this.route.params.subscribe((params) => {
      this.ProductService.getChatsForProduct(params['id']).subscribe((response: any) => {
        this.chats = response;
      });

    })



  }

  openChat(chat: any) {
    const dialogRef = this.dialog.open(ChatInterfaceComponent, {
      width: '30%',
      height: '70%',
      minWidth: '40rem',
      data: {
        chatData: chat,
        partner: chat.buyer,
      } // Pass the seller data to your dialog component
    });

  }

}
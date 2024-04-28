import { Component , Inject , Input } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/authentication/auth.service';
import { ChatService } from './chatdata.service';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})


export class ChatInterfaceComponent {

  constructor(public ProductService: ProductService,private ChatService : ChatService, private authService : AuthService, @Inject(MAT_DIALOG_DATA) public data: any) { }



  // take input mat dialog data

  currentUser = this.authService.getCurrentUser()? this.authService.getCurrentUser() : '';
  
  chatData = this.data.chatData;
  userData =  '';
  userName = '';
  sender = '';
  receiver = '';
  

  messages : any = [];
  newMessage = '';
  ngOnInit(){
  
    this.authService.getUserDetails().subscribe((user: any) => {
      this.userData = user.data;
      this.userName = user.data.firstName?  user.data.firstName : user.data.email.split('@')[0] ;
      console.log(this.userName , "chatDatataa");
    });
    console.log(this.chatData, "chatData")
    let chatid  = ''
    chatid = this.chatData.chatData? this.chatData.chatData : this.chatData._id;
    if(this.messages.length <= 0){
      this.ProductService.getChat(chatid).subscribe((message: any) => {
        if(message.messages && message.messages.length > 0){
          this.messages = message.messages;
          console.log(this.messages, "chatDataaaaaaaaa");
          let sellerid = message.seller;
          let buyerid = message.buyer;
          if(this.authService.getCurrentUser()._id == sellerid){
            this.sender = sellerid;
            this.receiver = buyerid;
        }
        else{

          this.sender = buyerid;
          this.receiver = sellerid;
        }
      }
      })
  
      }

    this.ChatService.joinRoom(this.data.chatData.chatData?this.data.chatData.chatData : this.data.chatData._id , this.authService.getCurrentUser()._id)
    this.ChatService
    .receiveMessage(this.data.chatData.chatData?this.data.chatData.chatData : this.data.chatData._id)
    .subscribe((message: any) => {
      if(this.messages.length != 0 && this.messages[this.messages.length - 1]['text'] != message.text && this.messages[this.messages.length - 1]['chatPartner'] != message.chatPartner ){
        console.log(this.messages, "pushing another message");
       this.messages.push(message);
       

      }
   
    });
  }

  sendMessage() {
  

    let currentTime = new Date();

    let newMsg = { 
        chatPartner: this.userName, 
        text: this.newMessage, 
        time: currentTime 
    }
    this.ChatService.sendMessage(newMsg,this.sender,this.receiver);
    this.messages.push(newMsg);
    console.log(this.data.chatData, "chatdata confirmation");

    this.ProductService.updateChat(this.data.chatData.chatData?this.data.chatData.chatData : this.data.chatData._id , this.messages).subscribe((message: any) => {  
      console.log(this.messages,"kakarot");

    } );
    this.newMessage = '';
  }

  //function to return 'right' or 'left' based on the sender of the message
  getAlignment(chatPartner: string) {
    return chatPartner == this.userName ? 'right' : 'left';
  }

  getAlignmentBubble(chatPartner: string) {
    return chatPartner == this.userName ? 'rightBubble' : 'leftBubble';
  }
}



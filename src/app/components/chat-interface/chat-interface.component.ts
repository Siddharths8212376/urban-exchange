import { Component , Inject , Input } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.scss']
})


export class ChatInterfaceComponent {

  constructor(public ProductService: ProductService, private authService : AuthService, @Inject(MAT_DIALOG_DATA) public data: any) { }



  // take input mat dialog data

  currentUser = this.authService.getCurrentUser()? this.authService.getCurrentUser() : '';
  
  chatData = this.data.chatData;
  userData =  '';
  userName = '';
  

  messages = [
    { chatPartner: 'Seller', text: 'Hi, how can I help you?' }
  ];
  newMessage = '';
  ngOnInit(){
  
    this.authService.getUserDetails().subscribe((user: any) => {
      this.userData = user.data;
      this.userName = user.data.firstName?  user.data.firstName : user.data.email.split('@')[0] ;
      console.log(this.userName , "chatDatataa");
    });
    
    this.ProductService.getChat(this.chatData.chatData).subscribe((message: any) => {
      if(message.messages && message.messages.length > 0){
        this.messages = message.messages;
      }
  
    })



  }

  sendMessage() {
  
    let newMsg = { chatPartner: this.userName, text: this.newMessage }
    this.messages.push(newMsg);
    this.ProductService.updateChat(this.data.chatData.chatData , this.messages).subscribe((message: any) => {  
      console.log(message,"kakarot");

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



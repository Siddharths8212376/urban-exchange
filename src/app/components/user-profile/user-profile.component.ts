import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { DataService } from 'src/app/services/data/data.service';
import { ProductService } from 'src/app/services/product/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ChatInterfaceComponent } from '../chat-interface/chat-interface.component';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  currentUser: any;
  chats: any[] = [];
  ischat: boolean = false;
  constructor(private fb: FormBuilder,
    private UserService: UserService,
    private dataService: DataService,
    private ProductService: ProductService,
    public dialog: MatDialog,
  ) {
    this.userProfileForm = this.fb.group({
      username: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      description: [''],
      Phone: [''],
      password: ['', Validators.required],
      avatar: ['default-avatar.png']
    });


  }

  ngOnInit(): void {
    this.dataService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
      if (currentUser) {
        this.UserService.userDetails(this.currentUser).subscribe((userData: any) => {
          // Update the form with retrieved data
          this.userProfileForm.patchValue(userData);
        });


        this.ProductService.getChatsForUser(this.currentUser._id).subscribe((response: any) => {
          this.chats = response;
          console.log(this.chats,"chattsss");
    });
      }


    })


     //api to get all chats basing current user as sender
    
}

  onSubmit() {
    if (this.userProfileForm.valid) {
      // Handle form submission here
      let userData = {
        "username": this.userProfileForm.value.username,
        "firstName": this.userProfileForm.value.firstName,
        "lastName": this.userProfileForm.value.lastName,
        "description": this.userProfileForm.value.description,
        "Phone": this.userProfileForm.value.Phone,
        "avatar": this.userProfileForm.value.avatar,
        "_id": this.currentUser._id,
        "email": this.currentUser.email,
      }



      this.UserService.setUserDetails(userData).subscribe((response: any) => {
        // Update the form with retrieved data
        this.userProfileForm.patchValue(response);
      });
    }
  }

  openProfile(){
    this.ischat = false;
  }

  openChat(){
    this.ischat = true;
  }

  openChatWindow(chat: any){
   //open chatinterface component in dialog
   const dialogRef = this.dialog.open(ChatInterfaceComponent, {
    width: '60%',
    height: '80%',
    data: { chatData : chat } // Pass the seller data to your dialog component
  });


  }

}
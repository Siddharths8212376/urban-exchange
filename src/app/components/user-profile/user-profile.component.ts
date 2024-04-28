import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { DataService } from 'src/app/services/data/data.service';
import { User } from 'src/app/models/user.model';
enum displayModes {
  view,
  edit
}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  currentUser!: User;
  displayMode: displayModes = displayModes.view;
  constructor(private fb: FormBuilder,
    private UserService: UserService,
    private dataService: DataService
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
      if (currentUser) {
        this.currentUser = currentUser;
        this.UserService.userDetails(this.currentUser).subscribe((userData: any) => {
          // Update the form with retrieved data
          this.userProfileForm.patchValue(userData);
        });
      }
    })

  }
  onClickEdit() {
    this.displayMode = displayModes.edit;
  }
  onClickCancel() {
    this.displayMode = displayModes.view;
  }
  getProcessedImage(imgSrc: string): string {
    imgSrc = imgSrc.replace('s96-c', 's250-c');
    return imgSrc;
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
        this.displayMode = displayModes.view;
      });
    }
  }
}
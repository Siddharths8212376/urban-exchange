import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userProfileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userProfileForm = this.fb.group({
      username: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      description: [''],
      phone: [''],
      password: ['', Validators.required],
      avatar: ['default-avatar.png']
    });
  }

  onSubmit() {
    if (this.userProfileForm.valid) {
      // Handle form submission here
      console.log(this.userProfileForm.value);
    }
  }
}
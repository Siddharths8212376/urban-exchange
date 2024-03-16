import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from '../auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import {
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  // isLoading = false;
  user: any;
  constructor(public authService: AuthService,
    private route: Router,
    private socialauthService: SocialAuthService) { }

  ngOnInit(): void {
    this.socialauthService.authState.subscribe((user) => {
      this.authService.logingoogle(user);
    });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    const email = form.value.email;
    const password = form.value.password;
    const username = form.value.username; // Assuming you added a username field
    const firstName = form.value.firstName; // Assuming you added a firstName field
    const lastName = form.value.lastName; // Assuming you added a lastName field
    const phone = form.value.phone; // Assuming you added a phone field

    this.authService.createUser(email, password, firstName, lastName, phone);
  }

  ngOnDestroy() {
    this.signOut();
  }

  loginWithGoogle(): void {

    let googleLoginOptions = {
      scope: 'profile email'
    };
    this.socialauthService.signIn(GoogleLoginProvider.PROVIDER_ID, googleLoginOptions).then((user) => {
      this.user = user;
      if (user && user.idToken)
        this.authService.logingoogle(user);

    });

  }


  signOut(): void {
    this.socialauthService.signOut();
  }



}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from '../auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import {
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';
import { User } from 'src/app/models/user.model';
import { defaultUser } from 'src/app/constants/user.constant';
import { UserService } from 'src/app/services/user/user.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading = false;
  user: User = defaultUser;
  constructor(public authService: AuthService,
    private route: Router,
    private socialauthService: SocialAuthService,
  ) { }

  ngOnInit(): void {
    this.socialauthService.authState.subscribe((user) => {
      if (user) {
        this.authService.logingoogle(user);
      }
    });
  }
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
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
      // Here, you can send the user's token to your Node.js backend for validation and JWT creation.
      if (user?.idToken)
        this.authService.logingoogle(user);

    });

  }


  signOut(): void {
    this.socialauthService.signOut();
  }
}


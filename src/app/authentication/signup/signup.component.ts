import { Component, OnInit , OnDestroy} from '@angular/core';
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
export class SignupComponent implements OnInit,OnDestroy {
  isLoading = false;
  // isLoading = false;
  user : any ;
  constructor(public authService: AuthService,
    private route :  Router,
    private socialauthService: SocialAuthService) {}

    ngOnInit(): void {
      this.socialauthService.authState.subscribe((user) => {
      
 
        this.authService.logingoogle(user.idToken);
        // console.log("user authtoken ," , user.authToken);
      }); 
    }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    console.log(form,"form");
     this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.signOut();
}

  loginWithGoogle(): void {

    let googleLoginOptions = {
      scope: 'profile email'
    };
    this.socialauthService.signIn(GoogleLoginProvider.PROVIDER_ID,googleLoginOptions ).then((user) => {
      this.user = user;
      if(user && user.idToken)
      this.authService.logingoogle(user.idToken);
      
    });
  
  }


  signOut(): void {
    this.socialauthService.signOut();
  }



}

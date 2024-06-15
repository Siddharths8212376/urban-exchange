import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AuthService } from './auth.service';
import { UserService } from '../services/user/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intervalPing!: any;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authToken = this.authService.getToken();
    if (!authToken && localStorage.getItem('token')) {
      authToken = localStorage['token'];
    }
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken),
    });
    if (
      this.authService.getIsAuth() &&
      !req.url.includes('pingUser') &&
      !this.intervalPing
    ) {
      this.intervalPing = setInterval(() => {
        this.ping();
      }, 30000);
    } else if (
      this.intervalPing &&
      !req.url.includes('pingUser') &&
      !this.authService.getIsAuth()
    ) {
      clearInterval(this.intervalPing);
    }
    return next.handle(authRequest);
  }
  ping() {
    let currentUser = this.authService.getCurrentUser();
    if (currentUser._id) {
      this.userService.setUserPing(currentUser._id).subscribe((response) => { });
      this.userService.sendNotif({ user: currentUser, status: "online" });
    }
  }
}

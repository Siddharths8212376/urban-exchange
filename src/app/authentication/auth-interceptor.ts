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
  intervalId!: any;
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
      !this.intervalId
    ) {
      this.intervalId = setInterval(() => {
        this.ping();
      }, 60000);
    } else if (
      this.intervalId &&
      !req.url.includes('pingUser') &&
      !this.authService.getIsAuth()
    ) {
      clearInterval(this.intervalId);
    }
    return next.handle(authRequest);
  }
  ping() {
    let currentUser = this.authService.getCurrentUser();
    if (currentUser._id) {
      this.userService.setUserPing(currentUser._id).subscribe((response) => { });
    }
  }
}

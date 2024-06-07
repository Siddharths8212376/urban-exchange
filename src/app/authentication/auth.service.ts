import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";

import { AuthData } from "./auth-data.model";
import { User } from "../models/user.model";
import { defaultUser } from "../constants/user.constant";
import { UserService } from "../services/user/user.service";
import { env } from "src/environments/environment";
import { DataService } from "../services/data/data.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
  private token: any;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private loggedOut = new Subject<boolean>();
  private currentUser: User = defaultUser;
  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: DataService,
    private userService: UserService,
  ) { }
  getCurrentUser() {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') as any);
    }
    return this.currentUser;
  }

  getUserDetails() {
    // this.getCurrentUser();
    let _id = JSON.parse(localStorage.getItem('currentUser') as any)._id;

    return this.http.get<{ message: string, data: User }>(`${env.apiUrl}/user/${_id}`);
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    const token = localStorage.getItem("token");
    if (token)
      this.autoAuthUser();

    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getLoggedOut() {
    return this.loggedOut.asObservable();
  }

  setLoggedOut(value: boolean) {
    this.loggedOut.next(value)
  }

  createUser(email: string, password: string, firstName?: string, lastName?: string, phone?: string) {
    const authData: AuthData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phone: phone
    };

    this.http.post(`${env.apiUrl}/user/`, authData)
      .subscribe(response => {
        this.router.navigate(["/login"]);
      });
  }
  setCurrentUser(user: User) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
      this.dataService.setCurrentUser(this.currentUser);
    }
  }


  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, user: User }>(
        `${env.apiUrl}/user/login`,
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        this.setCurrentUser(response.user);
        let wishlist: any = response.user.wishlist;
        if (wishlist) {
          this.userService.setUserWishlist(wishlist);
          localStorage.setItem('wishlist', JSON.stringify(wishlist));
          this.userService.sendNotif({ user: this.currentUser, status: "online" });
        }
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate);
          // should navigate to previous route
          this.router.navigate(["/home"]);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.loggedOut.next(true);
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userService.sendNotif({ user: this.currentUser, status: "offline" });
    this.setCurrentUser(defaultUser);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
    localStorage.removeItem('token');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  logingoogle(user: any) {
    this.http.post<any>(`${env.apiUrl}/user/googleAuth`, user)
      .subscribe((response) => {
        // Handle the response from the backend, which might include a JWT.
        if (response.token) {
          // Save the JWT in local storage
          if (response.user.length && response.user.length > 0) {
            response.user = response.user[0];
          }
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          localStorage.setItem('currentUser', response.user ? JSON.stringify(response.user as any) : 'null');
          this.currentUser = response.user;
          this.dataService.setCurrentUser(this.currentUser);
          this.userService.setUserWishlist(response.user.wishlist);
          localStorage.setItem('wishlist', JSON.stringify(response.user.wishlist));
          this.userService.sendNotif({ user: this.currentUser, status: "online" });
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(response.token, expirationDate);
          // should navigate to previous route
          this.router.navigate(["/home"]);
        }
      });
  }
}

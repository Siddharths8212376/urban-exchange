import { HttpClient } from '@angular/common/http';
import { Injectable, Injector} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth.service';
import { defaultUser } from 'src/app/constants/user.constant';
import { User } from 'src/app/models/user.model';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService{
  wishlist: any = [];
  constructor(
    private http: HttpClient,
    private injector: Injector
  ) { }
  addToUserProducts(productId: string) {
    let authService = this.injector.get(AuthService);
    let payload = {
      _id: authService.getCurrentUser()._id,
      productId: productId
    }
    return this.http.post(`${env.apiUrl}/user/add-product`, payload);
  }

  getUserWishlist() {
    let authService = this.injector.get(AuthService);
    let _id = authService.getCurrentUser()._id;
    return this.http.get(`${env.apiUrl}/user/get-wishlist/${_id}`);
  }
  setUserWishlist(wishlist: any) {
    this.wishlist = wishlist;
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
  getWislist() {
    if(this.wishlist.length == 0 && localStorage.getItem('wishlist')!=null) return JSON.parse(localStorage['wishlist']);
    return this.wishlist;
  }
  addToUserWishlist(wishlist: any) {
    this.setUserWishlist(wishlist);
    let authService = this.injector.get(AuthService);
    let payload = {
      _id: authService.getCurrentUser()._id,
      wishlist: wishlist
    }
    return this.http.post(`${env.apiUrl}/user/add-wishlist`, payload);
  }
  userDetails(userDetails: string) {
   
    return this.http.post(`${env.apiUrl}/user/getUserDetails`, userDetails);
  }

  //api to set user details
  setUserDetails(userDetails: any) {
    return this.http.post(`${env.apiUrl}/user/setUserDetails`, userDetails);
  }
}

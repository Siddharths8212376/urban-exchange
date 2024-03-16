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
  async getWislist() {
    if(this.wishlist.length == 0) {
      if(localStorage.getItem('wishlist')!=null) return JSON.parse(localStorage['wishlist']);
      else { 
        await this.getUserWishlist().subscribe((response: any) => {
          if(response) {
            this.setUserWishlist(response.data);
            return response.data;
          }

        });
      }
    }
    else return this.wishlist;
  }
  addDeleteFromUserWishlist(wishlist: any) {
    this.setUserWishlist(wishlist);
    let authService = this.injector.get(AuthService);
    let payload = {
      _id: authService.getCurrentUser()._id,
      wishlist: wishlist
    }
    return this.http.post(`${env.apiUrl}/user/add-wishlist`, payload);
  }
}

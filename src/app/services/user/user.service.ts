import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/authentication/auth.service';
import { defaultUser } from 'src/app/constants/user.constant';
import { User } from 'src/app/models/user.model';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }
  addToUserProducts(productId: string) {
    let payload = {
      _id: this.authService.getCurrentUser()._id,
      productId: productId
    }
    return this.http.post(`${env.apiUrl}/user/add-product`, payload);
  }


  userDetails(userDetails: string) {
   
    return this.http.post(`${env.apiUrl}/user/getUserDetails`, userDetails);
  }

  //api to set user details
  setUserDetails(userDetails: any) {
    return this.http.post(`${env.apiUrl}/user/setUserDetails`, userDetails);
  }
}

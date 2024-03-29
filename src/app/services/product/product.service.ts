import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConstants } from 'src/app/constants/app.constants';
import { ProductResponse } from 'src/app/dto/product-response.dto';
import { ProductSearchResponse } from 'src/app/dto/product-search-response.dto';
import { CreateFields } from 'src/app/models/create-product-fields.model';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // private socket;
  public message$: BehaviorSubject<any> = new BehaviorSubject({});
  
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: localStorage.getItem("token") as string
    })
  }
  constructor(private http: HttpClient) { 
    // this.socket = io('http://localhost:5000');
  }


  // public sendMessage(message : any) {
  //   this.socket.emit('message', message);
  // }

  // public getNewMessage = () => {
  //   this.socket.on('message', (message) =>{
  //     this.message$.next(message);
  //   });
    
  //   return this.message$.asObservable();
  // };

  getAllProducts(): Observable<{ message: string, data: Product[] }> {
    return this.http.get<{ message: string, data: Product[] }>(`${env.apiUrl}/product`);
  }
  getProductsByPageNoPageSizeAndOrCategory(page?: number, limit?: number, category?: string): Observable<ProductResponse> {
    if (!page) page = AppConstants.DEFAULT_PAGE_NO;
    if (!limit) limit = AppConstants.DEFAULT_PAGE_SIZE;
    let url = `${env.apiUrl}/product?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    return this.http.get<ProductResponse>(url);
  }
  getProductById(id: string): Observable<{ message: string, data: Product }> {
    return this.http.get<{ message: string, data: Product }>(`${env.apiUrl}/product/${id}`);
  }
  getProductTag(): Observable<{ message: string, data: string }> {
    return this.http.get<{ message: string, data: string }>(`${env.apiUrl}/product/tag`);
  }
  getProductCreateFields(): Observable<{ message: string, data: CreateFields[] }> {
    return this.http.get<{ message: string, data: CreateFields[] }>(`${env.apiUrl}/product/create-product-fields`);
  }
  getProductCategories(): Observable<{ message: string, data: string[] }> {
    return this.http.get<{ message: string, data: string[] }>(`${env.apiUrl}/product/product-categories`);
  }
  createProduct(payload: any): Observable<{ message: string, productId: string }> {

    let auth = this.httpOptions.headers.get('Authorization');
    
    console.log(auth, 'authHere');

    return this.http.post<{ message: string, productId: string }>(`${env.apiUrl}/product`, payload, this.httpOptions);
  }
  searchProduct(searchTerm: string): Observable<{ message: string, data: ProductSearchResponse[] }> {
    return this.http.get<{ message: string, data: ProductSearchResponse[] }>(`${env.apiUrl}/product/search/${searchTerm}`);
  }
  getProductListById(payload: any): Observable<{ message: string, data: Product[] }> {
    return this.http.post<{ message: string, data: Product[] }>(`${env.apiUrl}/product/product-list-by-id`, payload);
  }
  
  getChatId(currentUser : any , prodId  : any , seller : any){
    return this.http.post(`${env.apiUrl}/chat/getChatId`,{currentUser,prodId , seller});
  }

  createChat(currentUser: any ,prodId : any , seller : any ): Observable<{ message: string, data: any }> {
    return this.http.post<{ message: string, data: any }>(`${env.apiUrl}/chat/createChat`, {currentUser,prodId , seller});
  }
  updateChat(chatid : any ,messages : any[]  ): Observable<{ message: string, data: any }> {
    console.log(chatid , messages , 'chatid , messages');
    return this.http.post<{ message: string, data: any }>(`${env.apiUrl}/chat/updateChat`, {chatid , messages });
  }

  getChat(chatId : any){
    return this.http.get<{ message: string, data: string[] }>(`${env.apiUrl}/chat/getChat/${chatId}`);
  }
}

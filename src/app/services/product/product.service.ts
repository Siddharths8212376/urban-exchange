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
import { Chat } from 'src/app/models/chat.model';

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
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<{ message: string, data: Product[] }> {
    return this.http.get<{ message: string, data: Product[] }>(`${env.apiUrl}/product`);
  }
  getProductsByPageNoPageSizeAndOrCategory(payload: any): Observable<ProductResponse> {
    if (!payload.page) payload.page = AppConstants.DEFAULT_PAGE_NO;
    if (!payload.limit) payload.limit = AppConstants.DEFAULT_PAGE_SIZE;
    let url = `${env.apiUrl}/product?page=${payload.page}&limit=${payload.limit}&latitude=${payload.latitude}&longitude=${payload.longitude}`;
    if (payload.category) url += `&category=${payload.category}`;
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
  validatePinCode(attributeValue: any): Observable<any> {
    let body = { attributeValue };
    return this.http.post<any>(`${env.apiUrl}/product/validatePin`, body);
  }
  getProductCategories(): Observable<{ message: string, data: string[], metadata: { category: string, options: string[], subOptions: { category: string, field: string, options: string[] }[] }[] }> {
    return this.http.get<{ message: string, data: string[], metadata: { category: string, options: string[], subOptions: { category: string, field: string, options: string[] }[] }[] }>(`${env.apiUrl}/product/product-categories`);
  }
  createProduct(payload: any): Observable<{ message: string, productId: string }> {

    let auth = this.httpOptions.headers.get('Authorization');

    return this.http.post<{ message: string, productId: string }>(`${env.apiUrl}/product`, payload, this.httpOptions);
  }
  searchProduct(searchTerm: string): Observable<{ message: string, data: ProductSearchResponse[] }> {
    return this.http.get<{ message: string, data: ProductSearchResponse[] }>(`${env.apiUrl}/product/search/${searchTerm}`);
  }
  getProductListById(payload: any): Observable<{ message: string, data: Product[] }> {
    return this.http.post<{ message: string, data: Product[] }>(`${env.apiUrl}/product/product-list-by-id`, payload);
  }
  getChatId(currentUser: any, prodId: any, seller: any) {
    return this.http.post(`${env.apiUrl}/chat/getChatId`, { currentUser, prodId, seller });
  }
  getChatsForUser(sender: any) {
    return this.http.post(`${env.apiUrl}/chat/getChatsForUser`, { sender });
  }
  createChat(currentUser: any, prodId: any, seller: any): Observable<{ message: string, data: any }> {
    return this.http.post<{ message: string, data: any }>(`${env.apiUrl}/chat/createChat`, { currentUser, prodId, seller });
  }
  updateChat(chatid: any, messages: any[], unread: number, unreadBy: string | undefined): Observable<{ message: string, data: any }> {
    return this.http.post<{ message: string, data: any }>(`${env.apiUrl}/chat/updateChat`, { chatid, messages, unread, unreadBy });
  }
  getChat(chatId: any) {
    return this.http.get<{ message: string, data: string[] }>(`${env.apiUrl}/chat/getChat/${chatId}`);
  }
  setChatUpdateRead(chatInf: { chatId: string }) {
    return this.http.post<{ message: string, data: number }>(`${env.apiUrl}/chat/setChatUpdateRead`, chatInf);
  }
  getChatsForProduct(prodId: any) {
    return this.http.post(`${env.apiUrl}/chat/getChatsForProduct`, { prodId });
  }
  getUnreadCount(sender: any) {
    return this.http.post(`${env.apiUrl}/chat/getUnreadCount`, { sender });
  }
  updateUnread(unreadInf: any) {
    return this.http.post(`${env.apiUrl}/chat/updateUnread`, unreadInf);
  }
}

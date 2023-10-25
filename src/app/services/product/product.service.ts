import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateFields } from 'src/app/models/create-product-fields.model';
import { Product } from 'src/app/models/product.model';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: localStorage.getItem("token") as any
    })
  }
  constructor(private http: HttpClient) { }
  getAllProducts(): Observable<{ message: string, data: Product[] }> {
    return this.http.get<{ message: string, data: Product[] }>(`${env.apiUrl}/product`);
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
  createProduct(payload: any): Observable<{ message: string, productId: string }> {
    return this.http.post<{ message: string, productId: string }>(`${env.apiUrl}/product`, payload, this.httpOptions);
  }
}

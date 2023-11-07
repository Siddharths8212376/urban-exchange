import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  productFilters$ = new BehaviorSubject(null);
  constructor() { }
  getProductFilters() {
    return this.productFilters$.asObservable();
  }
  setProductFilters(productFilters: any) {
    this.productFilters$.next(productFilters);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  productFilters$ = new BehaviorSubject(null);
  currentUser$ = new BehaviorSubject(null);
  searchResults$ = new BehaviorSubject([]);
  constructor() { }
  getProductFilters() {
    return this.productFilters$.asObservable();
  }
  setProductFilters(productFilters: any) {
    this.productFilters$.next(productFilters);
  }
  getCurrentUser() {
    return this.currentUser$.asObservable();
  }
  setCurrentUser(currentUser: any) {
    this.currentUser$.next(currentUser);
  }
  getSearchResults() {
    return this.searchResults$.asObservable();
  }
  setSearchResults(searchResults: any) {
    this.searchResults$.next(searchResults);
  }
}

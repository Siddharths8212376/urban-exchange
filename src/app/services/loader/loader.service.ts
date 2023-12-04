import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  displayLoader$ = new BehaviorSubject<boolean>(false);
  constructor() { }
  start() {
    this.displayLoader$.next(true);
  }
  stop() {
    this.displayLoader$.next(false);
  }
}

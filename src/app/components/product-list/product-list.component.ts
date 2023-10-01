import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  v: any[] = [];
  ngOnInit() {
    for (let i = 0; i < 25; i++) {
      this.v.push(i + 1);
    }
  }
}

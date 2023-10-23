import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  v: any[] = [];
  @Input('products') products: Product[] = [];
  ngOnInit() {
    for (let i = 0; i < 25; i++) {
      this.v.push(i + 1);
    }
  }
}

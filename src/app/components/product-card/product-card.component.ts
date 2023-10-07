import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defaultProduct } from 'src/app/constants/product.constant';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: Product = defaultProduct;
  constructor(private router: Router) { }
  ngOnInit(): void {
  }
  openProduct() {
    this.router.navigate(['/product/1']);
  }
}

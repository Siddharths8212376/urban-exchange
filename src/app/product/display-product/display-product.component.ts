import { Component, OnInit } from '@angular/core';
import { defaultProduct } from 'src/app/constants/product.constant';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-display-product',
  templateUrl: './display-product.component.html',
  styleUrls: ['./display-product.component.scss']
})
export class DisplayProductComponent implements OnInit {
  product: Product = defaultProduct;
  entries: [string, any][] = [];
  constructor(private productService: ProductService) { }
  ngOnInit(): void {
    this.productService.getProductById('65339532aa4a88d207b5b2e6').subscribe(response => {
      this.product = response.data;
      this.entries = Object.entries(this.product);
      console.log(this.product, 'productHere', this.entries);
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  productCategories: string[] = [];
  constructor(
    private productService: ProductService,
  ) { }
  ngOnInit(): void {
    this.productService.getProductCategories().subscribe(response => this.productCategories = response.data);
  }
}

import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  products: Product[] = [];
  constructor(private productService: ProductService) { }
  ngOnInit(): void {
    this.productService.getProductsByPageNoPageSizeAndOrCategory().subscribe(response => this.products = response.data[0].products);
  }
}

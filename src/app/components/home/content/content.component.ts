import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProductResponse } from 'src/app/dto/product-response.dto';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  products: Product[] = [];
  totalCount: number = 0;
  pageNo: number = 0;
  pageSize: number = 25;
  constructor(private productService: ProductService) { }
  ngOnInit(): void {
    this.productService.getProductsByPageNoPageSizeAndOrCategory().subscribe(response => {
      this.setProductAndPageData(response);
    });
  }
  pageUpdateEvent(e: PageEvent) {
    this.productService.getProductsByPageNoPageSizeAndOrCategory(e.pageIndex, e.pageSize).subscribe(response => {
      this.setProductAndPageData(response);
    });
  }
  setProductAndPageData(response: ProductResponse) {
    this.products = response.data[0].products;
    this.totalCount = response.data[0].totalProducts[0].count;
    this.pageNo = response.page as number;
    this.pageSize = response.limit as number;
  }
}

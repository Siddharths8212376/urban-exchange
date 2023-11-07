import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  productCategories: { filterName: string, checked: boolean }[] = [];
  constructor(
    private productService: ProductService,
    private dataService: DataService,
  ) { }
  ngOnInit(): void {
    this.productService.getProductCategories().subscribe(response => {
      response.data.forEach(filter => this.productCategories.push({ filterName: filter, checked: false }));
      if (sessionStorage.getItem("filters")) {
        this.productCategories = JSON.parse(sessionStorage.getItem('filters') as any);
      }
    });
  }
  updateFilters(filter: string, $event: any) {
    let productCategory = this.productCategories.find(p => p.filterName == filter)
    if (productCategory) {
      productCategory.checked = $event.target.checked;
      sessionStorage.setItem("filters", JSON.stringify(this.productCategories));
      this.dataService.setProductFilters(this.productCategories);
    }
  }
}

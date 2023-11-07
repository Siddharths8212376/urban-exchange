import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnChanges {
  @Input('products') products: Product[] = [];
  filteredProducts: Product[] = [];
  productFilter: { filterName: string, checked: boolean }[] = [];
  constructor(private dataService: DataService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'].currentValue.length > 0) {
      this.filteredProducts = changes['products'].currentValue;
    }
  }
  //TODO: Update filters after pagination
  ngOnInit() {
    this.filteredProducts = this.products;
    this.dataService.getProductFilters().subscribe(response => {
      if (response) {
        this.productFilter = response;
      } else if (sessionStorage.getItem('filters')) {
        this.productFilter = JSON.parse(sessionStorage.getItem('filters') as any);
      }
      if (this.productFilter.find(filter => filter.checked == true)) {
        this.filteredProducts = this.products.filter(p => {
          let found = false;
          this.productFilter.forEach(filter => {
            if (filter.filterName == p.category && filter.checked) {
              found = true;
            }
          });
          return found;
        });
      } else {
        this.filteredProducts = this.products;
      }
    })
  }
}

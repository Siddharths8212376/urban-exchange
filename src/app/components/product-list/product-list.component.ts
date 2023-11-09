import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AppConstants } from 'src/app/constants/app.constants';
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
  @Input('totalCount') totalCount = 0;
  @Input('pageSize') pageSize = AppConstants.DEFAULT_PAGE_SIZE;
  @Input('pageNo') pageNo = AppConstants.DEFAULT_PAGE_NO;
  pageSizeOptions = AppConstants.DEFAULT_PAGE_SIZE_OPTIONS;
  @Output() pageUpdateEvent = new EventEmitter<PageEvent>();

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageEvent!: PageEvent;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.totalCount = e.length;
    this.pageSize = e.pageSize;
    this.pageNo = e.pageIndex;
    console.log('handlePageEvent', e);
    this.pageUpdateEvent.emit(e);
  }

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

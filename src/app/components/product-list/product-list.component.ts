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
export class ProductListComponent implements OnInit {
  @Input('products') products: Product[] = [];
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
    this.pageUpdateEvent.emit(e);
  }

  constructor(private dataService: DataService) { }

  //TODO: Update filters after pagination
  ngOnInit() { }
}

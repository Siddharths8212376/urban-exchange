import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AppConstants } from 'src/app/constants/app.constants';
import { ProductResponse } from 'src/app/dto/product-response.dto';
import { Product } from 'src/app/models/product.model';
import { DataService } from 'src/app/services/data/data.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
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
  productFilter: { filterName: string, checked: boolean }[] = [];
  latitude: any = '';
  longitude: any = '';

  constructor(
    private productService: ProductService,
    private dataService: DataService,
    public loader: LoaderService,
  ) { }
  async ngOnInit(): Promise<void> {
    await this.getUserLocation();
    this.dataService.getProductFilters().subscribe(response => {
      if (response) {
        this.productFilter = response;
      } else if (sessionStorage.getItem('filters')) {
        this.productFilter = JSON.parse(sessionStorage.getItem('filters') as any);
      }
      let filters = '';
      this.productFilter.forEach(filter => filter.checked == true ? filters += filter.filterName + ',' : null);
      if (filters.charAt(filters.length - 1) == ',') filters = filters.substring(0, filters.length - 1);
      if (filters.trim().length > 0) {
        let payload = {
          page: AppConstants.DEFAULT_PAGE_NO,
          limit: AppConstants.DEFAULT_PAGE_SIZE,
          category: filters,
          latitude: this.latitude,
          longitude: this.longitude,
        }
        this.productService.getProductsByPageNoPageSizeAndOrCategory(payload).subscribe(response => {
          this.setProductAndPageData(response);
        });
      } else {
        this.getAllProductData();
      }
    })
    this.dataService.getSearchResults().subscribe((response: any) => {
      if (response) {
        if (response.length > 0) {
          let idList = response.map((r: any) => r['_id']);
          let payload = {
            idList: idList
          }
          this.productService.getProductListById(payload).subscribe(productResponse => {
            this.products = productResponse.data;
            this.totalCount = this.products.length;
            this.pageNo = AppConstants.DEFAULT_PAGE_NO;
            this.pageSize = AppConstants.DEFAULT_PAGE_SIZE;
          })
        } else {
          this.getAllProductData();
        }
      }
    })
  }
  getAllProductData() {
    let payload = {
      latitude: this.latitude,
      longitude: this.longitude,
    }
    this.productService.getProductsByPageNoPageSizeAndOrCategory(payload).subscribe(response => {
      this.setProductAndPageData(response);
    });
  }
  pageUpdateEvent(e: PageEvent) {
    let payload = {
      page: e.pageIndex,
      limit: e.pageSize,
      latitude: this.latitude,
      longitude: this.longitude,
    }
    this.productService.getProductsByPageNoPageSizeAndOrCategory(payload).subscribe(response => {
      this.setProductAndPageData(response);
    });
  }
  setProductAndPageData(response: ProductResponse) {
    this.products = response.data[0].products;
    this.totalCount = response.data[0].totalProducts[0].count;
    this.pageNo = response.page as number;
    this.pageSize = response.limit as number;
  }

  async getUserLocation() {
    if (navigator.geolocation) {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          if(position) {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          }
          resolve("done");
        });
      });
    }
  }
}

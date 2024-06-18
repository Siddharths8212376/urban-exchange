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

  productSubFilters: {
    subFilterA: { category: string, options: { value: string, checked: boolean }[] } | null,
    subFiltersB: { category: string, field: string, options: { value: string, checked: boolean }[] | undefined }[] | null
  } | null = null;
  filtersValue: string = '';
  subFiltersValue: string = '';
  constructor(
    private productService: ProductService,
    private dataService: DataService,
    public loader: LoaderService,
  ) { }
  async ngOnInit(): Promise<void> {
    console.time('getUserLocation');
    console.log(navigator.geolocation, 'heyo');
    await this.getUserLocation();
    console.timeEnd('getUserLocation');
    this.dataService.getSubFilters().subscribe(response => {
      if (response) {
        this.productSubFilters = response;
        this.subFiltersValue = this.checkAndAddSubFilters();
        if (this.filtersValue.trim().length > 0) {
          let compositeFilter = this.filtersValue + this.subFiltersValue;
          let payload = {
            page: AppConstants.DEFAULT_PAGE_NO,
            limit: AppConstants.DEFAULT_PAGE_SIZE,
            latitude: this.latitude,
            longitude: this.longitude,
            category: compositeFilter
          }
          this.productService.getProductsByPageNoPageSizeAndOrCategory(payload).subscribe(response => {
            this.setProductAndPageData(response);
          });
        } else {
          this.getAllProductData();
        }
      } else {
        this.getAllProductData();
      }
    })
    this.dataService.getProductFilters().subscribe(response => {
      if (response) {
        this.productFilter = response;
      } else if (sessionStorage.getItem('filters')) {
        this.productFilter = JSON.parse(sessionStorage.getItem('filters') as any);
      }
      this.filtersValue = '';
      this.productFilter.forEach(filter => filter.checked == true ? this.filtersValue += filter.filterName + ',' : null);
      this.filtersValue = this.removeLastCharacterIfMatch(this.filtersValue, ',');
      // if (this.filtersValue.trim().length > 0) {
      //   this.productService.getProductsByPageNoPageSizeAndOrCategory(AppConstants.DEFAULT_PAGE_NO, AppConstants.DEFAULT_PAGE_SIZE, this.filtersValue).subscribe(response => {
      //     this.setProductAndPageData(response);
      //   });
      // } else {
      //   this.getAllProductData();
      // }
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
  removeLastCharacterIfMatch(s: string, char: string): string {
    if (s.charAt(s.length - 1) == char) s = s.substring(0, s.length - 1);
    return s;
  }
  checkAndAddSubFilters(): string {
    if (this.productSubFilters) {
      let subfilters = '';
      let subFilterA, subFiltersB;
      subFilterA = this.productSubFilters.subFilterA;
      subFiltersB = this.productSubFilters.subFiltersB;
      if (subFilterA) {
        let sa = '';
        subFilterA.options.forEach(opt => {
          if (opt.checked) sa += opt.value + ',';
        })
        sa = this.removeLastCharacterIfMatch(sa, ',');
        if (sa.length > 0) {
          subfilters = `|${sa}|`
        }
      }
      if (subFiltersB) {
        subFiltersB.forEach(subFilter => {
          if (subFilter.options) {
            subFilter.options.forEach(opt => {
              if (opt.checked) subfilters += opt.value + ',';
            })
          }
        })
        subfilters = this.removeLastCharacterIfMatch(subfilters, ',');
      }
      return subfilters;
    }
    return '';
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
          if (position) {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          }
          resolve("done");
        }, (err) => {
          this.latitude = 12.9716; this.longitude = 77.594566;
          resolve("default");
        }, { enableHighAccuracy: false, timeout: 1500, maximumAge: 3600000 });
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { subscribeOn } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  productCategories: { filterName: string, checked: boolean }[] = [];
  productMetadata: { category: string, options: string[], subOptions: { category: string, field: string, options: string[] }[] }[] = [];
  subFilterA!: { category: string, options: { value: string, checked: boolean }[] } | null;
  subFiltersB: { category: string, field: string, options: { value: string, checked: boolean }[] | undefined }[] | null = [];
  constructor(
    private productService: ProductService,
    private dataService: DataService,
  ) { }
  ngOnInit(): void {
    this.getProductCategoriesData();
  }
  getProductCategoriesData() {
    this.productService.getProductCategories().subscribe(response => {
      this.productMetadata = response.metadata;
      response.metadata.forEach(filter => this.productCategories.push({ filterName: filter.category, checked: false }));
      if (sessionStorage.getItem("filters")) {
        this.productCategories = JSON.parse(sessionStorage.getItem('filters') as any);
      }
    });
  }
  updateFilters(filter: string, $event: any) {
    let productCategory = this.productCategories.find(p => p.filterName == filter)
    this.productCategories.filter(p => p.filterName !== filter).forEach(f => f.checked = false);
    if (productCategory) {
      productCategory.checked = $event.target.checked;
      sessionStorage.setItem("filters", JSON.stringify(this.productCategories));
      this.dataService.setProductFilters(this.productCategories);
      let productMetadata = this.productMetadata.find(p => productCategory && p.category == productCategory.filterName);
      if (productMetadata) {
        if (productCategory.checked) {
          this.subFilterA = { category: productMetadata.category, options: productMetadata.options.map(opt => { return { value: opt, checked: false } }) }
        } else {
          this.subFilterA = null;
        }
        this.subFiltersB = [];
        this.setSubFilters();
      }
    }
  }
  setSubFilters() {
    this.dataService.setSubFilters({
      subFilterA: this.subFilterA,
      subFiltersB: this.subFiltersB
    });
  }
  updateSubFilters(filter: string, $event: any, filterLevel: number, subFilterField?: string) {
    let productCategory = this.productCategories.find(p => p.checked == true);
    if (filterLevel == 1) {
      let option = this.subFilterA?.options.find(opt => opt.value == filter);
      this.subFilterA?.options.filter(p => p.value !== filter).forEach(f => f.checked = false);
      this.subFiltersB = [];
      if (option && productCategory) {
        option.checked = $event.target.checked;
        let productMetadata = this.productMetadata.find(p => productCategory && p.category == productCategory.filterName);
        let subOptions = productMetadata?.subOptions;
        if (option.checked && subOptions) {
          subOptions.filter(opt => opt.category == filter).forEach(opt => {
            let subFilterB = { category: filter, field: opt.field, options: opt.options.map(opt => { return { value: opt, checked: false } }) }
            if (!this.subFiltersB) this.subFiltersB = [];
            if (subFilterB) {
              this.subFiltersB.push(subFilterB);
            }
          })
        }
      }
    } else if (this.subFiltersB && this.subFiltersB.length > 0) {
      this.subFiltersB?.forEach(sf => {
        if (sf.options && sf.field == subFilterField) {
          let option = sf.options.find(opt => opt.value == filter);
          if (option) option.checked = $event.target.checked;
        }
      })
      this.subFiltersB?.forEach(sf => {
        if (sf.options && sf.field == subFilterField) {
          sf.options.filter(opt => opt.value !== filter).forEach(opt => opt.checked = false);
        }
      })
    }
    this.setSubFilters();
  }
}

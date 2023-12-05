import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductSearchResponse } from 'src/app/dto/product-search-response.dto';
import { DataService } from 'src/app/services/data/data.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  /** search validation */
  searchInput: string = '';
  isValidSearchText!: boolean;
  showInvalidMessage!: boolean;
  searchItem: any;
  searchTextChanged: Subject<string> = new Subject<string>();
  searchResults: ProductSearchResponse[] = [];
  constructor(
    private productService: ProductService,
    private router: Router,
    private dataService: DataService,
  ) { }
  ngOnInit(): void {
    /**
     * only emit latest value for observable 
     * -- with debounce time 300ms
     * -- emit iff change is distinct from previous change
     */
    this.searchTextChanged.pipe(
      debounceTime(300), distinctUntilChanged()
    ).subscribe(searchItem => {
      this.searchInput = searchItem;
      this.onSearchItem();
    });
  }
  onChange($event: any) {
    this.searchTextChanged.next($event);
  }
  onSearchItem() {
    if (this.searchInput.trim().length > 0) {
      this.productService.searchProduct(this.searchInput.trim()).subscribe(response => {
        this.searchResults = response.data;
      })
    }
  }
  onSelectItem(product: ProductSearchResponse) {
    this.searchResults = [];
    this.router.navigate(['/product', product._id]);
  }
  displayItems() {
    if (this.searchResults.length > 0) {
      if (this.searchResults.length == 1) {
        this.onSelectItem(this.searchResults[0]);
        this.searchResults = [];
      } else {
        this.router.navigate(['/home']);
        setTimeout(() => {
          this.dataService.setSearchResults(this.searchResults);
        }, 200);
      }
    } else {
      this.dataService.setSearchResults([]);
    }
  }
}

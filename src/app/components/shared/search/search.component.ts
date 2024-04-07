import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductSearchResponse } from 'src/app/dto/product-search-response.dto';
import { DataService } from 'src/app/services/data/data.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  host: { '(document:click)': 'close($event)' },
})
export class SearchComponent implements OnInit {

  /** search validation */
  searchInput: string = '';
  isValidSearchText!: boolean;
  showInvalidMessage!: boolean;
  searchItem: any;
  searchTextChanged: Subject<string> = new Subject<string>();
  searchResults: ProductSearchResponse[] = [];
  displayAutoCompleteResults: boolean = false;
  constructor(
    private productService: ProductService,
    private router: Router,
    private dataService: DataService,
    private eRef: ElementRef,
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
      // for hashtag search
      let searchItem = this.searchInput.trim();
      if (searchItem[0] == '#') searchItem = searchItem.substring(1);
      this.productService.searchProduct(searchItem).subscribe(response => {
        this.searchResults = response.data;
        this.displayAutoCompleteResults = this.searchResults.length > 0;
      })
    }
  }
  onSelectItem(product: ProductSearchResponse) {
    this.displayAutoCompleteResults = false;
    this.router.navigate(['/product', product._id]);
  }
  displayItems() {
    if (this.searchResults.length > 0) {
      if (this.searchResults.length == 1) {
        this.onSelectItem(this.searchResults[0]);
        this.displayAutoCompleteResults = false;
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
  close($event: any) {
    if (!this.eRef.nativeElement.contains($event.target)) {
      this.displayAutoCompleteResults = false;
    }
  }
}

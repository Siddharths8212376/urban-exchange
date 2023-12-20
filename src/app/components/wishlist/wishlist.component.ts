import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user/user.service';
import { ImageService } from 'src/app/services/image/image.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  title = 'My Wishlist';
  wishlist: any = [];
  wishlistItems: Product[] = [];

  constructor(
    private router: Router,
    public loader: LoaderService,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private imageService: ImageService,
    private productService: ProductService,
  ) { }
  ngOnInit(): void {
    this.wishlist = this.userService.getWislist();
    if(this.wishlist.length > 0) {
      this.loader.start();
      this.productService.getProductListById({idList: this.wishlist}).subscribe(productResponse => {
        this.wishlistItems = productResponse.data;
        this.convertImage();
        this.loader.stop();
        // this.totalCount = this.products.length;
        // this.pageNo = AppConstants.DEFAULT_PAGE_NO;
        // this.pageSize = AppConstants.DEFAULT_PAGE_SIZE;
      })
    }
  }

  convertImage() {
    this.wishlistItems.forEach((product: any) => {
      let productImageName = product?.productImages?.length > 0 ? product.productImages[0] : '';
      if (productImageName.length > 0) {
        this.imageService.getImageByName(productImageName).subscribe(response => {
          let objectURL = URL.createObjectURL(response);
          product.productImages[0] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }, (error) => {
          console.error(error);
          // try cloud images
          this.imageService.getImageURLByName(productImageName).subscribe(response => {
            if (response.data) {
              product.productImages[0] = response.data.secureUrl;
            } else {
              product.productImages[0] = '../../assets/images/no-image.svg';
            }
          })
        })
      } else {
        product.productImages[0] = '../../assets/images/no-image.svg';
      }
    })
  }

  removeItem(id: any) {
    this.wishlistItems = this.wishlistItems.filter((item: any) => item._id !== id);
    this.wishlist = this.wishlist.filter((item: any) => item._id !== id);
    this.userService.setUserWishlist(this.wishlist);
  }

  viewDetails(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}

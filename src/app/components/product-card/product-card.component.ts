import { Component, Input, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { defaultProduct } from 'src/app/constants/product.constant';
import { Product } from 'src/app/models/product.model';
import { ImageService } from 'src/app/services/image/image.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: Product = defaultProduct;
  isInWishlist: boolean = false;
  wishlist: any = [];
  productImageName: string = '';
  productImage: any = null;
  constructor(
    private router: Router,
    public loader: LoaderService,
    private imageService: ImageService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    public authService: AuthService,
  ) { }
  async ngOnInit(): Promise<void> {
    this.wishlist = await this.userService.getWislist();
    this.isInWishlist = this.wishlist.includes(this.product._id);
    this.productImageName = this.product?.productImages?.length > 0 ? this.product.productImages[0] : '';
    if (this.productImageName.length > 0) {
      this.imageService.getImageByName(this.productImageName).subscribe(response => {
        let objectURL = URL.createObjectURL(response);
        this.productImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }, (error) => {
        console.error(error);
        // try cloud images
        this.imageService.getImageURLByName(this.productImageName).subscribe(response => {
          if (response.data) {
            this.productImage = response.data.secureUrl;
          } else {
            this.productImage = '../../assets/images/no-image.svg';
          }
        })
      })
    } else {
      this.productImage = '../../assets/images/no-image.svg';
    }
  }
  openProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  addToWishlist(event: Event) {
    event.stopPropagation();
    this.isInWishlist = !this.isInWishlist;
    if (this.isInWishlist) this.wishlist.unshift(this.product._id);
    else this.wishlist.splice(this.wishlist.indexOf(this.product._id), 1);
    this.loader.start();
    this.userService.addDeleteFromUserWishlist(this.wishlist).subscribe(response => {
      this.loader.stop();
    });
  }
}

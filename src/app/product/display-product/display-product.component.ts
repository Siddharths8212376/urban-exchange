import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { defaultProduct } from 'src/app/constants/product.constant';
import { Product } from 'src/app/models/product.model';
import { ImageService } from 'src/app/services/image/image.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-display-product',
  templateUrl: './display-product.component.html',
  styleUrls: ['./display-product.component.scss']
})
export class DisplayProductComponent implements OnInit {
  product: Product = defaultProduct;
  entries: [string, any][] = [];
  productId: string | any;
  productImages: string[] = [];
  imageFiles: File[] | any = [];
  inWishlistIcon: string = '../../../assets/images/inWishlist.svg';
  notInWishlistIcon: string = '../../../assets/images/notInWishlist.svg';
  wishlistIcon: string = this.notInWishlistIcon;
  wishlist: boolean = false;
  
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) { }
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(this.productId).subscribe(response => {
      this.product = response.data;
      this.productImages = this.product.productImages;
      this.entries = Object.entries(this.product);
      if (this.productImages.length > 0) {
        this.productImages.forEach(imageName => this.imageService.getImageByName(imageName).subscribe(image => {
          let objectURL = URL.createObjectURL(image);
          this.imageFiles.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
        }))
      } else {
        // this.imageFiles.push('../../../assets/images/Sony-WH-1000XM5.jpeg');
        this.imageFiles.push('../../assets/images/no-image.png');
      }
    })
  }

  onClickWishlist() {
    this.wishlist = !this.wishlist;
    this.wishlistIcon = this.wishlist ? this.inWishlistIcon : this.notInWishlistIcon;
  }
}

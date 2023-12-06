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
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) { }
  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.productId = this.route.snapshot.paramMap.get('id');
      this.getProductDetails();
    })
    this.productId = this.route.snapshot.paramMap.get('id');
  }
  getProductDetails() {
    this.imageFiles = [];
    this.productService.getProductById(this.productId).subscribe(response => {
      this.product = response.data;
      this.productImages = this.product.productImages;
      this.entries = Object.entries(this.product);
      if (this.productImages.length > 0) {
        this.productImages.forEach(imageName => this.imageService.getImageByName(imageName).subscribe(image => {
          let objectURL = URL.createObjectURL(image);
          this.imageFiles.push(this.sanitizer.bypassSecurityTrustUrl(objectURL));
        }, (error) => {
          console.error(error);
          // try cloud images
          this.imageService.getImageURLByName(imageName).subscribe(response => {
            if (response.data) {
              this.imageFiles.push(response.data.secureUrl);
            } else {
              this.imageFiles.push('../../assets/images/no-image.svg');
            }
          });
        }))
      } else {
        this.imageFiles.push('../../assets/images/no-image.svg');
      }
    })
  }
}

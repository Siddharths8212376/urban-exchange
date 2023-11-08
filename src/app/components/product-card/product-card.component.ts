import { Component, Input, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { defaultProduct } from 'src/app/constants/product.constant';
import { Product } from 'src/app/models/product.model';
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input('product') product: Product = defaultProduct;
  productImageName: string = '';
  productImage: any = null;
  constructor(
    private router: Router,
    private imageService: ImageService,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    this.productImageName = this.product?.productImages?.length > 0 ? this.product.productImages[0] : '';
    if (this.productImageName.length > 0) {
      this.imageService.getImageByName(this.productImageName).subscribe(response => {
        let objectURL = URL.createObjectURL(response);
        this.productImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    } else {
      this.productImage = '../../assets/images/no-image.png';
    }
  }
  openProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}

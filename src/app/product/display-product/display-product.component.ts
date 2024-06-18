import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { defaultProduct } from 'src/app/constants/product.constant';
import { Product } from 'src/app/models/product.model';
import { ImageService } from 'src/app/services/image/image.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { env } from 'src/environments/environment';
import { ChatInterfaceComponent } from '../chat-interface/chat-interface.component';
import { defaultUser } from 'src/app/constants/user.constant';

@Component({
  selector: 'app-display-product',
  templateUrl: './display-product.component.html',
  styleUrls: ['./display-product.component.scss'],
})
export class DisplayProductComponent implements OnInit {
  product: Product = defaultProduct;
  entries: [string, any][] = [];
  productId: string | any;
  productImages: string[] = [];
  imageFiles: File[] | any = [];
  isInWishlist: boolean = false;
  wishlist: any = [];

  currUser: any;

  productLocation: any = [];
  displayMap: boolean = env.type !== 'prod' ? true : false;

  constructor(
    private userService: UserService,
    private loader: LoaderService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public authService: AuthService,
    private router: Router
  ) { }
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe((param) => {
      this.productId = this.route.snapshot.paramMap.get('id');
      this.getProductDetails();
    });
    this.currUser = this.authService.getCurrentUser()
      ? this.authService.getCurrentUser()
      : '';
    this.productId = this.route.snapshot.paramMap.get('id');
    this.wishlist = await this.userService.getWislist();
    this.isInWishlist = this.wishlist.includes(this.productId);
  }
  getProductDetails() {
    this.imageFiles = [];
    this.productService.getProductById(this.productId).subscribe((response) => {
      this.product = response.data;
      this.productImages = this.product.productImages;
      console.log(this.product, 'here');
      if (this.product.address != undefined && this.product.address != null && this.product.address['location']) {
        this.productLocation = this.product.address.location.coordinates;
      }
      console.log(this.productLocation, 'hhh');
      this.entries = Object.entries(this.product);
      if (this.productImages.length > 0) {
        this.productImages.forEach((imageName) => {
          this.imageService.getImageByName(imageName).subscribe(
            (image) => {
              let objectURL = URL.createObjectURL(image);
              this.imageFiles.push(
                this.sanitizer.bypassSecurityTrustUrl(objectURL)
              );
            },
            (error) => {
              console.error(error);
              // try cloud images
              this.imageService
                .getImageURLByName(imageName)
                .subscribe((response) => {
                  if (response.data) {
                    this.imageFiles.push(response.data.secureUrl);
                  } else {
                    this.imageFiles.push('../../assets/images/no-image.svg');
                  }
                });
            }
          )
        });

      } else {
        this.imageFiles.push('../../assets/images/no-image.svg');
      }
    });
  }
  getProductLocation(product: Product): string {
    let loc = product.address?.meta ? product.address?.meta[0] : null;
    return loc
      ? `${loc.postalLocation}, ${loc.district}, ${loc.state}`
      : 'Bangalore';
  }
  async clickOnWishlist() {
    if (!this.authService.getIsAuth()) {
      this.router.navigate(['login']);
      return;
    }
    this.isInWishlist = !this.isInWishlist;
    if (this.isInWishlist) this.wishlist.unshift(this.productId);
    else {
      let productIndex = this.wishlist.indexOf(this.productId);
      if (productIndex !== -1) {
        this.wishlist.splice(productIndex, 1);
      }
    }

    this.loader.start();
    await this.userService
      .addDeleteFromUserWishlist(this.wishlist)
      .subscribe((response) => {
        this.loader.stop();
      });
  }

  openChat(seller: any) {
    if (!this.authService.getIsAuth()) {
      // redirect login
      this.router.navigate(['login']);
      return;
    }
    let currentUser = this.authService.getCurrentUser()
      ? this.authService.getCurrentUser()
      : '';
    this.productService
      .getChatId(currentUser, this.productId, seller)
      .subscribe((response: any) => {
        //if response is 404 then cr

        if (response && response.message !== 'Chat not found') {
          let data = {
            chatData: response.message,
            partner: seller,
          };
          this.openChatInterface(data);
        } else {
          let tempUser = defaultUser;
          tempUser._id = seller;
          this.userService.userDetails(tempUser).subscribe((sellerInfo) => {
            this.productService
              .createChat(currentUser, this.productId, sellerInfo)
              .subscribe((response) => {
                let data = {
                  chatData: response.data,
                  partner: seller,
                };

                this.openChatInterface(data);
              });
          });
        }
      });
  }

  openChatInterface(data: any) {
    const dialogRef = this.dialog.open(ChatInterfaceComponent, {
      width: '30%',
      height: '70%',
      minWidth: '40rem',
      data: data, // Pass the seller data to your dialog component
    });
  }

  checkIfProductisOfSeller(product: any) {
    return this.currUser._id == product.seller;
  }
}

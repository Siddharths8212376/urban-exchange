import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';  
import { defaultProduct } from 'src/app/constants/product.constant';
import { Product } from 'src/app/models/product.model';
import { ImageService } from 'src/app/services/image/image.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { ChatInterfaceComponent } from 'src/app/components/chat-interface/chat-interface.component'; 

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
  isInWishlist: boolean = false;
  wishlist: any = [];
 currUser : any;
  constructor(
    private userService: UserService,
    private loader: LoaderService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public authService: AuthService
  ) { }
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(param => {
      this.productId = this.route.snapshot.paramMap.get('id');
      this.getProductDetails();
      
    })
    this.currUser = this.authService.getCurrentUser()? this.authService.getCurrentUser() : '';
    this.productId = this.route.snapshot.paramMap.get('id');
    this.wishlist = await this.userService.getWislist();
    this.isInWishlist = this.wishlist.includes(this.productId);
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
  getProductLocation(product: Product): string {
    let loc = product.address?.meta[0];
    return loc ? `${loc.postalLocation}, ${loc.district}, ${loc.state}` : 'Bangalore';
  }
  async clickOnWishlist() {
    this.isInWishlist = !this.isInWishlist;

    if (this.isInWishlist) this.wishlist.unshift(this.productId);
    else {
      let productIndex = this.wishlist.indexOf(this.productId);
      if (productIndex !== -1) {
        this.wishlist.splice(productIndex, 1);
      }
    }

    this.loader.start();
    await this.userService.addDeleteFromUserWishlist(this.wishlist).subscribe(response => {
      this.loader.stop();
    });
  }

  openChat( seller : any ) {

     let currentUser = this.authService.getCurrentUser()? this.authService.getCurrentUser() : '';

    this.productService.getChatId(currentUser, this.productId,seller).subscribe((response: any) => {

      //if response is 404 then cr

    

      if(response &&  response.message != 'Chat not found') {
        console.log(response , 'response1'); 
        let data = {
          chatData : response
        }
        this.openChatInterface(data);
  
      } else {
        this.productService.createChat(currentUser, this.productId , seller).subscribe(response => {
          console.log(response.data , 'response2'); 
          let data = {
            chatData : response.data['_id']
          }
  
          this.openChatInterface(data);
        });
      }
    }
    );


  }

  openChatInterface(seller: any) {
    const dialogRef = this.dialog.open(ChatInterfaceComponent, {
      width: '60%',
      height: '80%',
      data: { chatData : seller } // Pass the seller data to your dialog component
    });
  }

  checkIfProductisOfSeller(product : any){
    return this.currUser._id == product.seller;
  }
}

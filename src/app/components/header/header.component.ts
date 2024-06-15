import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../../authentication/auth.service";
import { User } from "src/app/models/user.model";
import { DataService } from "src/app/services/data/data.service";
import { LoaderService } from "src/app/services/loader/loader.service";
import { ProductService } from "src/app/services/product/product.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  currentUser!: User;
  constructor(
    private authService: AuthService,
    public dataService: DataService,
    public loader: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
  ) { }
  private authListenerSubs!: Subscription;

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.dataService.getCurrentUser().subscribe(currentUser => {
      let _id = JSON.parse(localStorage.getItem('currentUser') as any)._id;
      if (_id) {
        this.productService.getUnreadCount(_id).subscribe((response: any) => {
          let unreadCount = response.unreadCount;
          this.dataService.setUnreadMessages(Number(unreadCount));
        });
        this.authService.getUserDetails().subscribe(response => {
          this.currentUser = response.data;
          if (!currentUser) {
            this.dataService.setCurrentUser(this.currentUser);
          }
        })
      }
    })

  }

  onLogout() {
    this.authService.logout();
  }

  openProfile(currentUser: User) {
    //redirect to profile page with user id
    this.router.navigate(['/profile', currentUser._id]);
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}

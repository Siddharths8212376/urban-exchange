import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "../../authentication/auth.service";
import { User } from "src/app/models/user.model";
import { DataService } from "src/app/services/data/data.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  currentUser: User | null = null;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
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

      this.authService.getUserDetails().subscribe(response => {
        this.currentUser = response.data;
        if (!currentUser || this.currentUser._id != currentUser['_id']) {
          this.dataService.setCurrentUser(this.currentUser);
        }
      })
    })
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}

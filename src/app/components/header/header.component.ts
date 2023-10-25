import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { MatToolbar } from "@angular/material/toolbar";

import { AuthService } from "../../authentication/auth.service";
import { User } from "src/app/models/user.model";
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { UserService } from "src/app/services/user/user.service";

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
  ) { }
  private authListenerSubs!: Subscription;

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}

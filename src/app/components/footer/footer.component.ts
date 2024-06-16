import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterEvent } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }
  isOnLoginSignUpPage: boolean = false;
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.url && (event.url.includes('login') || event.url.includes('signup')) && !this.authService.getIsAuth()) {
          this.isOnLoginSignUpPage = true;
        } else {
          this.isOnLoginSignUpPage = false;
        }
      }
    })
  }
}

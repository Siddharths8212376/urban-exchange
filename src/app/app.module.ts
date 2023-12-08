import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/home/content/content.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatIconModule } from '@angular/material/icon'
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';



import { HeaderComponent } from "./components/header/header.component";

import { AuthInterceptor } from "./authentication/auth-interceptor";
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RequestInterceptor } from './services/request/request.interceptor';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SearchComponent } from './components/shared/search/search.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ContentComponent,
    LoginComponent,
    SignupComponent,
    ProductCardComponent,
    ProductListComponent,
    ProductFilterComponent,
    UserProfileComponent,
    SearchComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule,
    MatIconModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    MatProgressBarModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:5000/api/user'], // Your Node.js API server URL
        sendAccessToken: true,
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('1074394604196-610lm57lcj94ovdii34lfib07mcolbqj.apps.googleusercontent.com'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],

  bootstrap: [AppComponent],

})

export class AppModule { }

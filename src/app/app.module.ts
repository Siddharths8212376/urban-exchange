import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/home/content/content.component';
import { HomeComponent } from './components/home/home.component';



import { HeaderComponent } from "./components/header/header.component";

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OAuthModule } from 'angular-oauth2-oidc';
import { env } from 'src/environments/environment';
import { AuthInterceptor } from "./authentication/auth-interceptor";
import { AuthGuard } from './authentication/auth.guard';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductFilterComponent } from './components/product-filter/product-filter.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SearchComponent } from './components/shared/search/search.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { RequestInterceptor } from './services/request/request.interceptor';

import { BannerComponent } from './banner/banner.component';
import { SharedModule } from './shared/shared.module';
import { ChatInterfaceComponent } from './product/chat-interface/chat-interface.component';
import { ChatListComponent } from './product/chat-list/chat-list.component';



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
    WishlistComponent,
    BannerComponent,
    ChatInterfaceComponent,
    ChatListComponent,
  ],
  imports: [
    BrowserModule,
    MatAutocompleteModule,
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
    MatDialogModule,
    SharedModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [`${env.apiUrl}/user`], // Your Node.js API server URL
        sendAccessToken: true,
      },
    }),
  ],
  providers: [
    AuthGuard,
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthGuard } from './authentication/auth.guard';
import { BannerComponent } from './banner/banner.component';
import { ChatListComponent } from './product/chat-list/chat-list.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [AuthGuard] },
  { path: 'banner', component: BannerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, },
  { path: 'wishlist', component: WishlistComponent, },
  { path: 'profile/:id', component: UserProfileComponent },
  { path: 'profile/:pid/chats', component: ChatListComponent },
  { path: 'product', loadChildren: () => import('./product/product.module').then(module => module.ProductModule) },
  { path: '**', redirectTo: '/home' }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


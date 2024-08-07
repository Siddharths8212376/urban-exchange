import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayProductComponent } from './display-product/display-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ChatListComponent } from './chat-list/chat-list.component';

const routes: Routes = [
    { path: '', component: CreateProductComponent },
    { path: ':id', component: DisplayProductComponent },
    { path: ':id/chats', component: ChatListComponent }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
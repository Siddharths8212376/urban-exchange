import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProductComponent } from './display-product/display-product.component';
import { ProductRoutingModule } from './product-routing.module';
import { CreateProductComponent } from '../product/create-product/create-product.component';



@NgModule({
  declarations: [
    DisplayProductComponent,
    CreateProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
  ]
})
export class ProductModule { }

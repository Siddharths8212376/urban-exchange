import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProductComponent } from './display-product/display-product.component';
import { ProductRoutingModule } from './product-routing.module';



@NgModule({
  declarations: [
    DisplayProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
  ]
})
export class ProductModule { }

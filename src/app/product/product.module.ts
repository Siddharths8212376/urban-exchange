import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProductComponent } from './display-product/display-product.component';
import { ProductRoutingModule } from './product-routing.module';
import { CreateProductComponent } from '../product/create-product/create-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    DisplayProductComponent,
    CreateProductComponent
  ],
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    ProductRoutingModule,
  ]
})
export class ProductModule { }

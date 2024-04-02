import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProductComponent } from './display-product/display-product.component';
import { ProductRoutingModule } from './product-routing.module';
import { CreateProductComponent } from '../product/create-product/create-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CarouselComponent } from './carousel/carousel.component';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatDialogModule } from '@angular/material/dialog';
import { GeolocationComponent } from './geolocation/geolocation.component';


@NgModule({
  declarations: [
    DisplayProductComponent,
    CreateProductComponent,
    CarouselComponent,
    GeolocationComponent
  ],
  imports: [
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    ProductRoutingModule,
    MatIconModule,
    MatDialogModule
  ]
})
export class ProductModule { }

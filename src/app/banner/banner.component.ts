import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  carouselFiles: File[] | any = [];
  cardFiles: File[] | any = [];
  topBrands: string[] = ['Apple', 'Samsung', 'Adidas', 'Puma', 'Nike', 'Sony', 'LuluLemon'];
  constructor() { }
  ngOnInit(): void {
    this.carouselFiles = [];
    this.cardFiles = [];
    for (let i = 1; i <= 3; i++) {
      this.carouselFiles.push(`../../assets/images/carousel-${i}.png`);
    }
    for (let i = 1; i <= 4; i++) {
      this.cardFiles.push(`../../assets/images/card-${i}.png`);
    }
  }
}

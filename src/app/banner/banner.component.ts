import { AfterContentChecked, AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare let gsap: any;

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewChecked {
  carouselFiles: File[] | any = [];
  cardFiles: File[] | any = [];
  topBrands: string[] = ['Apple', 'Samsung', 'Adidas', 'Puma', 'Nike', 'Sony', 'LuluLemon'];
  scriptElem!: HTMLScriptElement;
  constructor(
    private router: Router,
  ) {
    this.scriptElem = document.createElement('script');
    this.scriptElem.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.3/TextPlugin.min.js";
    document.body.appendChild(this.scriptElem);
  }
  ngOnInit(): void {
    this.carouselFiles = [];
    this.cardFiles = [];
    for (let i = 1; i <= 3; i++) {
      this.carouselFiles.push(`../../assets/images/carousel-${i}.png`);
    }
    for (let i = 1; i <= 4; i++) {
      this.cardFiles.push(`../../assets/images/card-${i}.png`);
    }
    if (gsap) {
      gsap.to(".flash-sale", { duration: 0.5, text: "FLASH SALE 🔛", },);
    }
  }
  ngAfterViewChecked(): void {
    gsap.to(".flash-sale", { duration: 0.5, text: "FLASH SALE 🔛", }, "+=0.2");
  }
  navigateTo(path: string) {
    this.router.navigate([`${path}`]);
  }
}

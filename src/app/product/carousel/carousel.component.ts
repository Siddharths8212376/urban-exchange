import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  constructor(private router: Router) { }
  @Input() imageFiles: any[] = [];
  @Input() isBanner: boolean = false;
  bannerDim!: {
    height: number,
    width: number,
  };
  selectedIdx: number = 0;
  ngOnInit(): void {
    this.bannerDim = {
      height: (window.innerWidth * 0.8) / 4,
      width: window.innerWidth * 0.8
    }
    if (this.isBanner) {
      let timeOut = setTimeout(() => {
        let intervalId = setInterval(() => {
          if (this.imageFiles.length > 0) {
            this.selectedIdx = (this.selectedIdx + 1) % this.imageFiles.length;
          }
        }, 3000);
        clearTimeout(timeOut);
      }, 2000);

    }
  }
  updateIdx(val: "prev" | "next") {
    if (val == "prev") {
      if (this.selectedIdx == 0) this.selectedIdx = this.imageFiles.length - 1;
      else this.selectedIdx--;
    } else {
      this.selectedIdx = (this.selectedIdx + 1) % this.imageFiles.length;
    }
  }
  navigateTo(path: string) {
    this.router.navigate([`${path}`]);
  }
  setSelImage(index: number) {
    this.selectedIdx = index;
  }
}

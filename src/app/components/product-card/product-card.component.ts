import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit(): void {

  }
  openProduct() {
    this.router.navigate(['/product/1']);
  }
}

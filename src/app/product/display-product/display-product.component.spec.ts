import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayProductComponent } from './display-product.component';

describe('DisplayProductComponent', () => {
  let component: DisplayProductComponent;
  let fixture: ComponentFixture<DisplayProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayProductComponent]
    });
    fixture = TestBed.createComponent(DisplayProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

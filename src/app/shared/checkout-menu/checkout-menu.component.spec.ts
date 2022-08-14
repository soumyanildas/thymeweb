import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutMenuComponent } from './checkout-menu.component';

describe('CheckoutMenuComponent', () => {
  let component: CheckoutMenuComponent;
  let fixture: ComponentFixture<CheckoutMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

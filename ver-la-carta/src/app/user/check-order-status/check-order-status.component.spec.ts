import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckOrderStatusComponent } from './check-order-status.component';

describe('CheckOrderStatusComponent', () => {
  let component: CheckOrderStatusComponent;
  let fixture: ComponentFixture<CheckOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckOrderStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

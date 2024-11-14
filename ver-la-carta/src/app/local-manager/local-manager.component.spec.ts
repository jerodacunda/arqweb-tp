import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalManagerComponent } from './local-manager.component';

describe('LocalManagerComponent', () => {
  let component: LocalManagerComponent;
  let fixture: ComponentFixture<LocalManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

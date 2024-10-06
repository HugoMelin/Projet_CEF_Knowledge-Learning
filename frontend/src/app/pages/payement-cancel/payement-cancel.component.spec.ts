import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementCancelComponent } from './payement-cancel.component';

describe('PayementCancelComponent', () => {
  let component: PayementCancelComponent;
  let fixture: ComponentFixture<PayementCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayementCancelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayementCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

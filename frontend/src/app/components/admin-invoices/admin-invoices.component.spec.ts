import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvoicesComponent } from './admin-invoices.component';

describe('AdminInvoicesComponent', () => {
  let component: AdminInvoicesComponent;
  let fixture: ComponentFixture<AdminInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

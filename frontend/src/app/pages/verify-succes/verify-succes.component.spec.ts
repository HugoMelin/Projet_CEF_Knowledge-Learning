import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifySuccesComponent } from './verify-succes.component';

describe('VerifySuccesComponent', () => {
  let component: VerifySuccesComponent;
  let fixture: ComponentFixture<VerifySuccesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifySuccesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifySuccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

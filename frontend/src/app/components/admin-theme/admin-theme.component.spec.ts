import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminThemeComponent } from './admin-theme.component';

describe('AdminThemeComponent', () => {
  let component: AdminThemeComponent;
  let fixture: ComponentFixture<AdminThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminThemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

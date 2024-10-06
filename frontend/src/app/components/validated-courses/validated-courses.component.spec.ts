import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedCoursesComponent } from './validated-courses.component';

describe('ValidatedCoursesComponent', () => {
  let component: ValidatedCoursesComponent;
  let fixture: ComponentFixture<ValidatedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatedCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

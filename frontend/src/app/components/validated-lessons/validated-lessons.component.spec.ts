import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedLessonsComponent } from './validated-lessons.component';

describe('ValidatedLessonsComponent', () => {
  let component: ValidatedLessonsComponent;
  let fixture: ComponentFixture<ValidatedLessonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatedLessonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidatedLessonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

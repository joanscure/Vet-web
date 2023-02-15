import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateUserComponent } from './generate-user.component';

describe('GenerateUserComponent', () => {
  let component: GenerateUserComponent;
  let fixture: ComponentFixture<GenerateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

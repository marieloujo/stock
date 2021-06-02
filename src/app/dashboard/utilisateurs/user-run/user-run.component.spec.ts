import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from "ngx-spinner";

import { UserRunComponent } from './user-run.component';

describe('UserRunComponent', () => {
  let component: UserRunComponent;
  let fixture: ComponentFixture<UserRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRunComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

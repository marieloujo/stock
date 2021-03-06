import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from "ngx-spinner";

import { MagasinComponent } from './magasin.component';

describe('MagasinComponent', () => {
  let component: MagasinComponent;
  let fixture: ComponentFixture<MagasinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagasinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MagasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

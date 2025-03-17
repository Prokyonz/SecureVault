import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddctsComponent } from './addcts.component';

describe('AddctsComponent', () => {
  let component: AddctsComponent;
  let fixture: ComponentFixture<AddctsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddctsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddctsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

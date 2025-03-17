import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewctsComponent } from './viewcts.component';

describe('ViewctsComponent', () => {
  let component: ViewctsComponent;
  let fixture: ComponentFixture<ViewctsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewctsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewctsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

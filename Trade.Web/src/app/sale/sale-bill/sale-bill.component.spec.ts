import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleBillComponent } from './sale-bill.component';

describe('SaleBillComponent', () => {
  let component: SaleBillComponent;
  let fixture: ComponentFixture<SaleBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleBillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

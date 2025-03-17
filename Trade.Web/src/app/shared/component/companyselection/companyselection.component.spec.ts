import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyselectionComponent } from './companyselection.component';

describe('CompanyselectionComponent', () => {
  let component: CompanyselectionComponent;
  let fixture: ComponentFixture<CompanyselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyselectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

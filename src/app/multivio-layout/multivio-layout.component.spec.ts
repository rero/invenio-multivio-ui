import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultivioLayoutComponent } from './multivio-layout.component';

describe('MultivioLayoutComponent', () => {
  let component: MultivioLayoutComponent;
  let fixture: ComponentFixture<MultivioLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultivioLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultivioLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

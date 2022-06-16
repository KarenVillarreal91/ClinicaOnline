import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaHistoriaClinicaComponent } from './tabla-historia-clinica.component';

describe('TablaHistoriaClinicaComponent', () => {
  let component: TablaHistoriaClinicaComponent;
  let fixture: ComponentFixture<TablaHistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaHistoriaClinicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

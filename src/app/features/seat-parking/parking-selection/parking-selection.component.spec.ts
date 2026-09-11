import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingSelectionComponent } from './parking-selection.component';

describe('ParkingSelectionComponent', () => {
  let component: ParkingSelectionComponent;
  let fixture: ComponentFixture<ParkingSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParkingManagementComponent } from './admin-parking-management.component';

describe('AdminParkingManagementComponent', () => {
  let component: AdminParkingManagementComponent;
  let fixture: ComponentFixture<AdminParkingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminParkingManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminParkingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

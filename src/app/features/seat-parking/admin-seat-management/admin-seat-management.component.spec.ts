import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSeatManagementComponent } from './admin-seat-management.component';

describe('AdminSeatManagementComponent', () => {
  let component: AdminSeatManagementComponent;
  let fixture: ComponentFixture<AdminSeatManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSeatManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSeatManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PumpPressureCalibrationModalPage } from './pump-pressure-calibration-modal.page';

describe('PumpPressureCalibrationModalPage', () => {
  let component: PumpPressureCalibrationModalPage;
  let fixture: ComponentFixture<PumpPressureCalibrationModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PumpPressureCalibrationModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PumpPressureCalibrationModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

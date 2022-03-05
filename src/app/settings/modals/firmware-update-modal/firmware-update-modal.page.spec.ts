import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FirmwareUpdateModalPage } from './firmware-update-modal.page';

describe('FirmwareUpdateModalPage', () => {
  let component: FirmwareUpdateModalPage;
  let fixture: ComponentFixture<FirmwareUpdateModalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmwareUpdateModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FirmwareUpdateModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

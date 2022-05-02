import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BanplusComponent } from './banplus.component';

describe('BanplusComponent', () => {
  let component: BanplusComponent;
  let fixture: ComponentFixture<BanplusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanplusComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BanplusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

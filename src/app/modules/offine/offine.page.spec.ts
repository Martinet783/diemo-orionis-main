import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OffinePage } from './offine.page';

describe('OffinePage', () => {
  let component: OffinePage;
  let fixture: ComponentFixture<OffinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OffinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

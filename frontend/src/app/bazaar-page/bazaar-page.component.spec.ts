import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BazaarPageComponent } from './bazaar-page.component';

describe('BazaarPageComponent', () => {
  let component: BazaarPageComponent;
  let fixture: ComponentFixture<BazaarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BazaarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BazaarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

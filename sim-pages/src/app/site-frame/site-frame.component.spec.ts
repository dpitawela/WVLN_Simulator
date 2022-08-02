import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteFrameComponent } from './site-frame.component';

describe('SiteFrameComponent', () => {
  let component: SiteFrameComponent;
  let fixture: ComponentFixture<SiteFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

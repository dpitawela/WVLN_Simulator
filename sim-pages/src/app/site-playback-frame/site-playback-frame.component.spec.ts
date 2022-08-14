import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitePlaybackFrameComponent } from './site-playback-frame.component';

describe('SitePlaybackFrameComponent', () => {
  let component: SitePlaybackFrameComponent;
  let fixture: ComponentFixture<SitePlaybackFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SitePlaybackFrameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SitePlaybackFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

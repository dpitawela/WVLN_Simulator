import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseComponent } from './base/base.component';
import { SiteFrameComponent } from './site-frame/site-frame.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlaybackBaseComponent } from './playback-base/playback-base.component';
import { SitePlaybackFrameComponent } from './site-playback-frame/site-playback-frame.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    SiteFrameComponent,
    PlaybackBaseComponent,
    SitePlaybackFrameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

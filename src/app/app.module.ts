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
import { MatDialogModule } from '@angular/material/dialog';
import { CorsDialogComponent } from './site-frame/cors-dialog/cors-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RecordSuccessDialogComponent } from './base/record-success-dialog/record-success-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatChipsModule } from '@angular/material/chips';
import { LoadDataComponent } from './playback-base/load-data/load-data.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SimComComponent } from './sim-com/sim-com.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    SiteFrameComponent,
    PlaybackBaseComponent,
    SitePlaybackFrameComponent,
    CorsDialogComponent,
    RecordSuccessDialogComponent,
    LoadDataComponent,
    SimComComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    MatInputModule,
    FormsModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

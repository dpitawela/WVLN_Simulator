import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { PlaybackBaseComponent } from './playback-base/playback-base.component';
import { SiteFrameComponent } from './site-frame/site-frame.component';

const routes: Routes = [
  { path: 'playback', component: PlaybackBaseComponent },
  { path: '**', component: BaseComponent,}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

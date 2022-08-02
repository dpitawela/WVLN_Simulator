import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteFrameComponent } from './site-frame/site-frame.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

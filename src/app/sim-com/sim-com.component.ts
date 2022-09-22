import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sim-com',
  templateUrl: './sim-com.component.html',
  styleUrls: ['./sim-com.component.css']
})
export class SimComComponent {
  // iframe base url
  url: SafeResourceUrl = ''

  strURL = 'assets/crawled/hansel/hanselfrombasel.com/index.html'
  constructor(private sanitizer: DomSanitizer) {
    this.updateURL(this.strURL)
  }

  updateURL(url: string) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

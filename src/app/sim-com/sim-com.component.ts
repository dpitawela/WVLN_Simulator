import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sim-com',
  templateUrl: './sim-com.component.html',
  styleUrls: ['./sim-com.component.css']
})
export class SimComComponent implements AfterViewInit {
  // iframe base url
  url: SafeResourceUrl = ''
  strURL = 'assets/crawled/hansel/hanselfrombasel.com/index.html'
  // strURL = 'assets/crawled/sna/www.sarahandabraham.com/index.html'
  // strURL = 'assets/crawled/es/index.html'

  // to detect iframe
  @ViewChild('myframe') iframe: ElementRef | any;

  // iframe error handling
  lastSuccessfulURL: string | undefined = ''
  clickEvent: MouseEvent | any;
  eventRefresher: any; // interval timer to refresh iframe event bindings

  constructor(private sanitizer: DomSanitizer) {
    this.updateURL(this.strURL)
  }

  ngAfterViewInit(): void {
    let nativeEl = this.iframe.nativeElement;
    this.eventRefresher = setInterval(() => this.eventBinder(nativeEl), 1000)
  }

  updateURL(url: string) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  // this function refreshes all event bindings to the iframe every second
  eventBinder(nativeEl: ElementRef | any): void {
    nativeEl.contentWindow.removeEventListener('click', this.clickEvent)
    this.clickEvent = (event: any) => this.clickDetect(event, nativeEl)
    nativeEl.contentWindow.addEventListener('click', this.clickEvent)
  }

  clickDetect(event: any, element: any): void {
    if (event.target.closest("a") != null) {
      let anchorTag: HTMLAnchorElement = event.target.closest("a")
      anchorTag.target = "_self" // forcing links to open inside the iframe
    }
  }

  addToHistory() {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    try {
      if (this.iframe == null) {
        return
      }
      // last successful url is stored
      this.lastSuccessfulURL = iframe.contentWindow?.location.pathname.substring(1)

    } catch (error) {
      if (this.lastSuccessfulURL != null) {
        // redirects the user to the last successful URL
        iframe.contentWindow?.location.replace(this.lastSuccessfulURL)
      }
    }
  }

}

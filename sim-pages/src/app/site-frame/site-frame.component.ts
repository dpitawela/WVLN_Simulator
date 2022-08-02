import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-site-frame',
  templateUrl: './site-frame.component.html',
  styleUrls: ['./site-frame.component.css']
})
export class SiteFrameComponent implements AfterViewInit {
  // for mouse movements
  move_wait_itr: number = 0
  scroll_wait_itr: number = 0
  x_pos_old = 0
  y_pos_old = 0

  // for scrolling
  current_y_pos = window.pageYOffset;
  current_x_pos = window.pageXOffset;
  scrollEvent: MouseEvent | any;

  // iframe base url
  url: SafeResourceUrl

  // to detect iframe
  @ViewChild('myframe') iframe: ElementRef | any;

  constructor(private sanitizer: DomSanitizer) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('assets/crawled/nationalRailwaySA/nationalRailwaySA/index.html');
  }


  eventBinder(nativeEl: ElementRef | any): void {
    nativeEl.contentWindow.removeEventListener('click', this.clickDetect)
    nativeEl.contentWindow.addEventListener('click', this.clickDetect)

    nativeEl.contentWindow.removeEventListener('mousemove', this.moveDetect)
    nativeEl.contentWindow.addEventListener('mousemove', this.moveDetect)

    nativeEl.contentWindow.removeEventListener('scroll', this.scrollEvent)
    this.scrollEvent = (event: MouseEvent) => this.scrollDetect(event, nativeEl)
    nativeEl.contentWindow.addEventListener('scroll', this.scrollEvent)
  }

  ngAfterViewInit(): void {
    let nativeEl = this.iframe.nativeElement;
    setInterval(() => this.eventBinder(nativeEl), 1000)
  }

  clickDetect(event: any): void {
    // detects if only clicked on a link
    if (event.target.closest("a") != null) {
      let href: string = event.target.closest("a").getAttribute("href")
      parent.postMessage({ 'type': 'click', 'x': event.clientX, 'y': event.clientY, 'href': href })
    }
    // console.log(event.target['baseURI'])    
  }

  moveDetect(event: MouseEvent): void {
    parent.postMessage({ 'type': 'move', 'x': event.clientX, 'y': event.clientY })
  }

  scrollDetect(event: MouseEvent, element: any): void {
    parent.postMessage({ 'type': 'scroll', 'y_offset': element.contentWindow.pageYOffset, 'x_offset': element.contentWindow.pageXOffset })
  }

  @HostListener("window:message", ["$event"])
  reciveDataFromIframe(message: any): void {
    if (message.data['type'] == 'click') {
      this.clickHandle(message)
    } else if (message.data['type'] == 'move') {
      this.moveHandle(message)
    } else if (message.data['type'] == 'scroll') {
      this.scrollHandle(message)
    }
  }

  clickHandle(message: MessageEvent): void {
    console.log("click", message.data['x'], message.data['y'], message.data['href'])
  }

  moveHandle(message: MessageEvent): void {
    this.move_wait_itr -= 1;
    if (this.move_wait_itr <= 0) {
      let text:string = ""
      let x_pos: number = message.data['x']
      let y_pos: number = message.data['y']

      if (x_pos > this.x_pos_old) {
        text = "Moved right"
      }

      if (x_pos < this.x_pos_old) {
        text = "Moved left"
      }

      if (y_pos > this.y_pos_old) {
        text = "Moved down"
      }

      if (y_pos < this.y_pos_old) {
        text = "Moved up"
      }
      console.log(text, x_pos, y_pos)

      this.x_pos_old = x_pos
      this.y_pos_old = y_pos
      this.move_wait_itr = 10
    }
  }

  scrollHandle(message: MessageEvent): void {
    this.scroll_wait_itr -= 1;
    if (this.scroll_wait_itr <= 0) {
      let text:string = ""
      let scroll_verticle = message.data['y_offset'];
      let scroll_horizontal = message.data['x_offset']
    
      if (scroll_verticle > this.current_y_pos) {
       text = 'scrollDown'
      }
      if (scroll_verticle < this.current_y_pos) {
        text = 'scrollUp';
      }

      if (scroll_horizontal > this.current_x_pos) {
        text = 'scrollRight';
      }
      if (scroll_horizontal < this.current_x_pos) {
        text = 'scrollLeft'
      }
      console.log(text)

      this.current_y_pos = scroll_verticle;
      this.current_x_pos = scroll_horizontal;
      this.scroll_wait_itr = 5
    }
  }
}

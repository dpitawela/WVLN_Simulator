import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StoreModel } from '../types/storeModel';

@Component({
  selector: 'app-site-frame',
  templateUrl: './site-frame.component.html',
  styleUrls: ['./site-frame.component.css']
})
export class SiteFrameComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() isRecordingStarted: boolean = false; // indicates whether to record
  @Output() saveRecording = new EventEmitter<StoreModel>();

  recordings: string = "";
  eventRefresher: any; // interval timer to refresh iframe event bindings

  // for mouse movements
  move_wait_itr: number = 0
  x_pos_old = 0
  y_pos_old = 0

  // for scrolling
  scroll_wait_itr: number = 0
  current_y_pos = window.pageYOffset;
  current_x_pos = window.pageXOffset;
  scrollEvent: MouseEvent | any;

  // iframe base url
  url: SafeResourceUrl

  // to detect iframe
  @ViewChild('myframe') iframe: ElementRef | any;

  constructor(private sanitizer: DomSanitizer) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl('assets/crawled/hansel/index.html');
  }

  ngAfterViewInit(): void {
    let nativeEl = this.iframe.nativeElement;
    this.eventRefresher = setInterval(() => this.eventBinder(nativeEl), 1000)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['isRecordingStarted'].currentValue && this.recordings.length > 5) {
      this.saveRecording.emit({ 'url': this.url, 'actions': this.recordings } as StoreModel)
      this.recordings = "";
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.eventRefresher)
  }

  // this function refreshes all event bindings to the iframe every second
  eventBinder(nativeEl: ElementRef | any): void {
    nativeEl.contentWindow.removeEventListener('click', this.clickDetect)
    nativeEl.contentWindow.addEventListener('click', this.clickDetect)

    nativeEl.contentWindow.removeEventListener('mousemove', this.moveDetect)
    nativeEl.contentWindow.addEventListener('mousemove', this.moveDetect)

    nativeEl.contentWindow.removeEventListener('scroll', this.scrollEvent)
    this.scrollEvent = (event: MouseEvent) => this.scrollDetect(event, nativeEl)
    nativeEl.contentWindow.addEventListener('scroll', this.scrollEvent)
  }

  // -------------- event listners that work inside iframe content window (child) ---------------
  clickDetect(event: any): void {
    // detects if only clicked on a link
    if (event.target.closest("a") != null) {
      let href: string = event.target.closest("a").getAttribute("href")
      parent.postMessage({ 'type': 'click', 'x': event.clientX, 'y': event.clientY, 'href': href, 'outer_html': event.target.outerHTML })
    }
    // console.log(event.target.outerHTML)
    // console.log(event.target['baseURI'])    
  }

  moveDetect(event: MouseEvent): void {
    parent.postMessage({ 'type': 'move', 'x': event.clientX, 'y': event.clientY })
  }

  scrollDetect(event: MouseEvent, element: any): void {
    parent.postMessage({ 'type': 'scroll', 'y_offset': element.contentWindow.pageYOffset, 'x_offset': element.contentWindow.pageXOffset })
  }

  // -------------- parent level event handlers ---------------
  // a window level message listner to captures postMessages from iframe document
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
    let text = "click," + message.data['x'] + "," + message.data['y'] + "," + message.data['href'] + "," + message.data['outer_html'];
    if (this.isRecordingStarted) {
      this.recordings += text + "\n"
      console.log(text)
    }
  }

  moveHandle(message: MessageEvent): void {
    this.move_wait_itr -= 1;
    if (this.move_wait_itr <= 0) {
      let text: string = ""
      let x_pos: number = message.data['x']
      let y_pos: number = message.data['y']

      if (x_pos > this.x_pos_old) {
        text = "moved_right"
      }

      if (x_pos < this.x_pos_old) {
        text = "moved_left"
      }

      if (y_pos > this.y_pos_old) {
        text = "moved_down"
      }

      if (y_pos < this.y_pos_old) {
        text = "moved_up"
      }

      if (this.isRecordingStarted) {
        text += "," + x_pos + "," + y_pos
        this.recordings += text + "\n"
        // console.log(text)
      }

      this.x_pos_old = x_pos
      this.y_pos_old = y_pos
      this.move_wait_itr = 20
    }
  }

  scrollHandle(message: MessageEvent): void {
    this.scroll_wait_itr -= 1;
    if (this.scroll_wait_itr <= 0) {
      let text: string = ""
      let scroll_verticle = message.data['y_offset'];
      let scroll_horizontal = message.data['x_offset']

      if (scroll_verticle > this.current_y_pos) {
        text = 'scroll_down'
      }
      if (scroll_verticle < this.current_y_pos) {
        text = 'scroll_up';
      }

      if (scroll_horizontal > this.current_x_pos) {
        text = 'scroll_right';
      }
      if (scroll_horizontal < this.current_x_pos) {
        text = 'scroll_left'
      }

      if (this.isRecordingStarted) {
        this.recordings += text + "\n"
        // console.log(text)
      }

      this.current_y_pos = scroll_verticle;
      this.current_x_pos = scroll_horizontal;
      this.scroll_wait_itr = 5
    }
  }
}

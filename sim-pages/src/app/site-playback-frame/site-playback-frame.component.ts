import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-site-playback-frame',
  templateUrl: './site-playback-frame.component.html',
  styleUrls: ['./site-playback-frame.component.css']
})

export class SitePlaybackFrameComponent implements OnChanges {
  url: SafeResourceUrl = '' // url bound to iframe
  strURL: string = "assets/crawled/hansel/hanselfrombasel.com/index.html" // to have a string reference to current url
  @Input() retrievedActions: string = ''
  @Input() isPlaying: boolean = false
  @Output() isPlayingChange = new EventEmitter<boolean>();

  addDelay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  // to detect iframe
  @ViewChild('myframe') iframe: ElementRef | any;

  constructor(private sanitizer: DomSanitizer) {
    this.updateURL(this.strURL)
  }

  async startPlaying() {
    let actions: string[] = this.retrievedActions.split('\n') // taking actions array
    // console.log(actions)

    for (var action of actions) {
      // await new Promise(f => setTimeout(f, 200));
      await this.addDelay(200)

      let actionData: string[] = action.split(',') // taking params of a single action

      if (actionData[0] == 'click') {
        console.log(actionData);

        this.clickHighlight(actionData[4]);
        await this.addDelay(2000)

        this.clickPlay(actionData[3])
      }
    }
    this.isPlayingChange.emit(false);
  }

  clickHighlight(elementOuterHTML: string) {
    let nativeEl = this.iframe.nativeElement
    // console.log(nativeEl.contentDocument.getElementsByClassName("button"))
    // let rep:string = nativeEl.contentDocument.body.innerHTML
    // rep = rep.replace('Free Shipping on US Orders $75+', 'orange')



    let repl: string = '<span style="background-color: #ff4081;">'
    // nativeEl.contentDocument.body.innerHTML = nativeEl.contentDocument.body.innerHTML.replace('<a href="collections/womens-new-arrivals.html" class="button\n                        button-medium\n                        button-white\n                        txt-size-2\n                        txt-tracked-two-point">\n                 Shop New Arrivals\n              </a>', '<span style="background-color: #ff4081;"><a href="collections/womens-new-arrivals.html" class="button\n                        button-medium\n                        button-white\n                        txt-size-2\n                        txt-tracked-two-point">\n                 Shop New Arrivals\n              </a>')
    nativeEl.contentDocument.body.innerHTML = nativeEl.contentDocument.body.innerHTML.replace(elementOuterHTML, repl + elementOuterHTML)

  }

  clickPlay(relativeURL: string) {
    this.updateURL(relativeURL)
  }

  updateURL(relativeURL: string): void {
    let currentURLParts: string[] = this.strURL.split('/')

    if (relativeURL.startsWith('.')) {
      console.log("with dot")
      this.strURL = currentURLParts.slice(0, -2).join('/') + relativeURL.substring(2)
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.strURL);

    } else if (relativeURL.startsWith('assets')) { // index page
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(relativeURL);

    } else { // if new relative url is a forward from current page
      this.strURL = currentURLParts.slice(0, -1).join('/') + '/' + relativeURL
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.strURL);
      console.log("Relative link", this.strURL)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isPlaying'].currentValue) {
      this.startPlaying()
    }
  }
}

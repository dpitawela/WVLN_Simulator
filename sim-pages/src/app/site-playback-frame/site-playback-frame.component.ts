import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActionModel, StoreModel } from '../types/model';


@Component({
  selector: 'app-site-playback-frame',
  templateUrl: './site-playback-frame.component.html',
  styleUrls: ['./site-playback-frame.component.css'],
  // animations: [
  //   trigger('inout', [
  //     transition('void => *', [
  //       style({ opacity: 0 }),           // initial styles
  //       animate('5000ms',
  //         style({ opacity: 1 })          // final style after the transition has finished
  //       )
  //     ]),
  //     transition('* => void', [
  //       animate('500ms',
  //         style({ opacity: 0 })          // we asume the initial style will be always opacity: 1
  //       )
  //     ])
  //   ])
  // ]
})

export class SitePlaybackFrameComponent implements OnChanges, OnInit {
  url: SafeResourceUrl = '' // url bound to iframe
  strURL: string = '' // to have a string reference to current url
  @Input() retrievedActions: StoreModel = {} as StoreModel
  @Input() isPlaying: boolean = false
  @Output() isPlayingChange = new EventEmitter<boolean>();
  actions: ActionModel[] = []

  // anchor tag/button colours/attributes
  allAnchorsColour = '#3f51b5'
  clickedAnchorColour = '#ff4081'
  clickedAnchorId = "clickedAnchor"

  addDelay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }

  // to detect iframe
  @ViewChild('myframe') iframe: ElementRef | any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.strURL = this.retrievedActions.url
    console.log(this.strURL)
    this.updateURL(this.strURL)
  }

  async startPlaying() {
    if (this.retrievedActions.actions)
      for (var action of this.retrievedActions.actions) {
        await this.addDelay(1000)
        this.highlightClickables(action.outer_html ? action.outer_html : '');
        await this.addDelay(2000)
        this.scrollToTheButton()
        await this.addDelay(1000)


        if (action.type == 'click') {
          // console.log(action);
          this.clickHighlight(action.outer_html ? action.outer_html : '');
          await this.addDelay(2000)
          this.clickPlay(action.href ? action.href : '')
        }
      }
    this.isPlayingChange.emit(false);
  }

  // this method highlights all clickables
  highlightClickables(clickedElementOuterHTML: string) {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    if (iframe.contentDocument != null) {
      let htmlDoc: Document = new DOMParser().parseFromString(iframe.contentDocument.body.innerHTML, 'text/html'); // parsing needed anchor tag html
      let anchors: HTMLCollectionOf<HTMLAnchorElement> = htmlDoc.getElementsByTagName('a')

      for (let anchor of Array.from(anchors)) {
        if (anchor.outerHTML == clickedElementOuterHTML) {
          anchor.id = this.clickedAnchorId
        }
        anchor.style.borderStyle = "solid"
        anchor.style.borderColor = this.allAnchorsColour
      }
      // updating the ifram document
      iframe.contentDocument.body.innerHTML = iframe.contentDocument.body.innerHTML.replace(iframe.contentDocument.body.innerHTML, htmlDoc.documentElement.innerHTML)
    }
  }

  scrollToTheButton() {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    if (iframe.contentDocument != null)
      iframe.contentDocument.getElementById(this.clickedAnchorId)?.scrollIntoView({ block: 'center', behavior: 'smooth' })

  }

  // this method highlights the link clicked
  async clickHighlight(elementOuterHTML: string) {
    let iframe: HTMLIFrameElement = this.iframe.nativeElement // taking all html code displayed on the iframe at the moment
    let htmlDoc: Document = new DOMParser().parseFromString(elementOuterHTML, 'text/html'); // parsing needed anchor tag html
    let anchor: HTMLAnchorElement | null;
    let anchorClickableStyled: any
    anchor = htmlDoc.querySelector('a')

    anchorClickableStyled = anchor?.cloneNode(true)
    anchorClickableStyled.style.borderStyle = "solid"
    anchorClickableStyled.style.borderColor = this.allAnchorsColour
    anchorClickableStyled.id = this.clickedAnchorId

    if (anchor != null && iframe.contentDocument != null) {
      // adding styles to the anchor
      anchor.style.borderStyle = "solid"
      anchor.style.borderColor = this.clickedAnchorColour
      anchor.style.borderWidth = "5px"
      anchor.style.backgroundColor = this.clickedAnchorColour

      let boundingClientRect: any = anchor.getBoundingClientRect()
      console.log(anchor)
      let animatingDiv: HTMLDivElement = this.clickAnimation(iframe)
      // console.log(animatingDiv)
      anchor.appendChild(animatingDiv)

      // console.log(elementOuterHTML)
      // console.log(htmlDoc)
      // console.log(anchor)

      // updating iframe document
      iframe.contentDocument.body.innerHTML = iframe.contentDocument.body.innerHTML.replace(anchorClickableStyled.outerHTML, anchor.outerHTML)
      await this.addDelay(400)
      iframe.contentDocument.getElementById('animatingDiv')?.remove()
    }
  }
  clickAnimation(iframe: HTMLIFrameElement): HTMLDivElement {
    if (iframe.contentDocument != null) {
      // let animatingDiv: HTMLDivElement = iframe.contentDocument.createElement('div')

      let animatingDiv: HTMLImageElement = iframe.contentDocument.createElement('img')
      animatingDiv.src = "https://img.pikbest.com/png-images/20190917/black-mouse-click-effect-gif-element-dynamic-image_2515118.png!c1024wm0"

      const style = iframe.contentDocument.createElement('style');
      style.innerHTML = `
      .clickEffect {
        // position: relative;
        box-sizing: border-box;
        border-style: solid;
        border-color: black;
        border-radius: 50%;
        animation: clickEffect 0.5s ease-out;
        z-index: 99999;
        // display: flex;

        // width: 20px;
        // margin-left: -8em;
        // margin-top: -100em;
    }
    
    @keyframes clickEffect {
        0% {
          opacity: 1;
          width: 0.5em;
          height: 0.5em;
          margin: -0.25em;
          border-width: 0.5em;

          display:flex;
            // position: relative;
            // display:flex;
            // justify-content:center;
            // align-items:center;
        }
    
        100% {
          opacity: 0.2;
          width: 15em;
          height: 15em;
          margin: -7.5em;
          border- width: 0.03em;

          display:flex;

            // position: relative;
            // display:flex;
            // justify-content:center;
            // align-items:center;
        }
    }
    `;

      iframe.contentDocument.head.appendChild(style);
      animatingDiv.className = "clickEffect"
      animatingDiv.id = 'animatingDiv'

      let script:any = iframe.contentDocument.createElement('script')   
      // script.innerHTML = `document.getElementById('animatingDiv').addEventListener('animationend',function(){document.getElementById('animatingDiv').parentElement.removeChild(document.getElementById('animatingDiv'));}.bind(this));`
      iframe.contentDocument.head.appendChild(script);


      return animatingDiv
    }
return new HTMLDivElement()
  }

clickPlay(relativeURL: string) {
  this.updateURL(relativeURL)
}

updateURL(relativeURL: string): void {
  let currentURLParts: string[] = this.strURL.split('/')

    if(relativeURL.startsWith('.')) {
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
  if(changes['isPlaying'].currentValue) {
  this.startPlaying()
}
  }
}

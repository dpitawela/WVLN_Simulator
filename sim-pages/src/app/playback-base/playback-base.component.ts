import { Component } from '@angular/core';

@Component({
  selector: 'app-playback-base',
  templateUrl: './playback-base.component.html',
  styleUrls: ['./playback-base.component.css']
})
export class PlaybackBaseComponent {
  retrievedActions: string
  isPlaying: boolean = false

  constructor() {
    this.retrievedActions = "moved_down,913,215\nmoved_down,825,381\nmoved_down,683,553\nmoved_down,655,569\nclick,655,569,collections/womens-new-arrivals.html,<a href=\"collections/womens-new-arrivals.html\" class=\"button\n                        button-medium\n                        button-white\n                        txt-size-2\n                        txt-tracked-two-point\">\n                 Shop New Arrivals\n              </a>\nmoved_up,785,143\nmoved_up,700,69\nmoved_up,681,13\nclick,681,12,../pages/shipping.html,<a href=\"../pages/shipping.html\" title=\"Shipping Policy\" tabindex=\"0\">Free Shipping on US Orders $75+</a>\nmoved_down,1091,31\nmoved_up,1129,0\n"
    //"moved_down,1058,6\nmoved_down,911,404\nmoved_down,787,584\nmoved_left,708,584\nclick,667,575,collections/womens-new-arrivals.html,<a href=\"collections/womens-new-arrivals.html\" class=\"button\n                        button-medium\n                        button-white\n                        txt-size-2\n                        txt-tracked-two-point\">\n                 Shop New Arrivals\n              </a>\nmoved_up,665,581\nmoved_down,649,583\nmoved_up,637,531\nmoved_up,274,462\nmoved_down,328,489\nclick,355,489,womens-new-arrivals/products/sweet-tie-dye-crew.html,<img src=\"../../cdn.shopify.com/s/files/1/0780/4991/products/hfb_110938_sweet_tie_dye_crew_navy_1024x1024a6d7.jpg?v=1652222948\" alt=\"navy\" data-variant-id=\"39390706303023\" class=\"product-card-image\n                    js-variant-switcher\n                    \n                     is-active\n                    \">\nmoved_up,536,401\nmoved_up,1170,103\n"
    // "moved_down,857,2\nmoved_down,859,176\nmoved_down,842,327\nmoved_down,709,409\nmoved_down,614,544\nmoved_down,548,599\nmoved_up,537,575\nclick,537,573,collections/womens-new-arrivals.html,<a href=\"collections/womens-new-arrivals.html\" class=\"button\n                        button-medium\n                        button-white\n                        txt-size-2\n                        txt-tracked-two-point\">\n                 Shop New Arrivals\n              </a>\nmoved_up,785,373\nmoved_up,906,141\nmoved_up,865,8\n"
    
    
    
    // "moved_up,820,3\nmoved_down,713,10\nmoved_left,415,10\nmoved_down,397,36\nmoved_down,347,54\nmoved_down,331,82\nmoved_down,364,92\nmoved_up,407,89\nclick,413,78,collections/womens.html,<a href=\"collections/womens.html\" id=\"nav-main-womens\" data-top=\"womens\" class=\"nav-link\n              js-top-drawer-hover\n              \">\n      Women's\n    </a>\nmoved_down,733,93\nmoved_down,1465,242\nmoved_down,1614,299\n"
    // this.retrievedActions = "moved_down,541,87\nscroll_down\nscroll_up\nscroll_up\nmoved_down,450,133\nmoved_down,321,355\nmoved_down,318,434\nclick,326,477,collections/womens-new-arrivals.html\nmoved_up,351,426\nmoved_up,356,375\n"   
    // this.retrievedActions = "moved_down,1256,138\nmoved_down,1151,302\nmoved_down,1034,411\nmoved_down,941,439\nmoved_down,858,501\nmoved_down,855,542\nmoved_down,844,580\nclick,844,580,collections/womens-new-arrivals.html\nscroll_down\nscroll_down\nscroll_down\nmoved_up,952,530\nmoved_up,989,497\nmoved_up,1026,473\nmoved_up,1410,34\n"    
  }
}

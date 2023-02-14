import { ElementRef, Injectable, ViewChild } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  //@ViewChild('js_loader') js_loader: LoaderComponent;
  elementLoader: any;
  constructor() {}
  hide() {
    this.elementLoader = document.getElementById('js_loader');
    if (!this.elementLoader) {
      return;
    }
    this.elementLoader.className = 'hidden';
  }
  show() {
    this.elementLoader = document.getElementById('js_loader');
    if (!this.elementLoader) {
      return;
    }
    this.elementLoader.className = '';
  }
}

import { Component } from '@angular/core';
import { LocalstorageService } from '../../services/localstorage.services';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  user: any;
  constructor(private lStorage: LocalstorageService) {
    this.user = lStorage.get('USER');
  }
}

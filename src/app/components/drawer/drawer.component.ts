import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../services/localstorage.services';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  user: any;
  constructor(private lStorage: LocalstorageService, private router: Router) {
    this.user = lStorage.get('USER');
  }
  logout() {
    this.lStorage.remove('USER');
    this.router.navigateByUrl('/login');
  }
}

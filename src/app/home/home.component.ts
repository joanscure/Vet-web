import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public storageS: LocalstorageService, private router: Router) {}

  ngOnInit(): void {
    if (!this.storageS.get('USER')) {
      this.router.navigateByUrl('/login');
    }
  }
}

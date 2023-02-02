import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  constructor() {}
  get(key: any) {
    let data = localStorage.getItem(btoa(key));
    return data == null ? undefined : JSON.parse(atob(data));
  }
  set(key: any, item: any) {
    let data = btoa(JSON.stringify(item));
    localStorage.setItem(btoa(key), data);
  }
  remove(key: any) {
    localStorage.removeItem(btoa(key));
  }
  clear() {
    localStorage.clear();
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList',
})
export class FilterListPipe implements PipeTransform {
  transform(items: any[], key: string): any[] {
    if (!items) {
      return [];
    }

    if (!key) return items;

    let keys: any = Object.keys(items[0]);

    if (keys.includes(key)) return [];

    let filter = key
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return items.filter((x) => {
      let cad = JSON.stringify(x);
      keys.forEach((element: string) => {
        cad = cad.replace(element, '');
      });
      cad = cad
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return cad.includes(filter);
    });
  }
}

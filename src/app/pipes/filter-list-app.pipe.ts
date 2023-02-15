import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterListApp',
})
export class FilterListAppPipe implements PipeTransform {
  transform(
    items: any[],
    key: string,
    client: string,
    vet: string,
    status: number
  ): any[] {
    if (!items) {
      return [];
    }

    let keys: any = Object.keys(items[0]);

    if (keys.includes(key)) return [];

    items = client == '0' ? items : items.filter((x) => x.userId == client);

    items = vet == '0' ? items : items.filter((x) => x.assignedId == vet);

    items =
      status == 0
        ? items
        : items.filter((x) => {
            if (status == 1 && x.isClose == false) {
              return true;
            }

            if (status == 2 && x.isClose == true && x.isApproved == true) {
              return true;
            }

            if (status == 3 && x.isClose == true && x.isApproved == false) {
              return true;
            }
            return false;
          });

    if (!key) return items;

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

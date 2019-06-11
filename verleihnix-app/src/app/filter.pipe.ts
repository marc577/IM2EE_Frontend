import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[],active: boolean, key: string, value:any): any[] {
    if(!items) return [];
    if(!value || !active) return items;
    value = value.toLowerCase();
    return items.filter( it => {
      const el = it[key];
      if(typeof el == 'string'){
        return el.toLowerCase().includes(value);
      }
      if(typeof el == 'number'){
        return el == value;
      }
    });
   }
}

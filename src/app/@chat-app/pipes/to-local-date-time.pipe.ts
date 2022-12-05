import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocalDateTime',
  standalone: true
})
export class ToLocalDateTimePipe implements PipeTransform {

  transform(value: any): String {
    let date = new Date(value);
    return date.toLocaleString('fa');
  }

}

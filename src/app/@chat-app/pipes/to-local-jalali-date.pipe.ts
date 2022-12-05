import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocalJalaliDate',
  standalone: true
})
export class ToLocalJalaliDatePipe implements PipeTransform {

  transform(value: any): String {
    let date = new Date(value + ' 00:00:00');
    return date.toLocaleDateString('fa');
  }

}

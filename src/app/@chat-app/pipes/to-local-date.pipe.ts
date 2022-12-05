import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toLocalDate',
  standalone: true
})
export class ToLocalDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Pipe({
  name: 'toLocalTime',
  standalone: true
})
export class ToLocalTimePipe implements PipeTransform {

  constructor() {

  }

  transform(value: any): String {
    let date = new Date(value);
    return date.toLocaleTimeString('fa');
  }

}

import { Pipe, PipeTransform } from '@angular/core';
import { ContactApiService } from '../services/contact-api.service';
import { lastValueFrom } from 'rxjs';

@Pipe({
  name: 'toUserFullName',
  standalone: true
})
export class ToUserFullNamePipe implements PipeTransform {
  constructor(private contactApiService: ContactApiService) {

  }

  async transform(value: String): Promise<any> {
    let fullName = this.contactApiService.getUserFullName(value);
    return await lastValueFrom(fullName);
  }
}

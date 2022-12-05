import { Pipe, PipeTransform } from '@angular/core';
import { ContactApiService } from '../services/contact-api.service';
import { lastValueFrom } from 'rxjs';

@Pipe({
  name: 'toUserProfileImage',
  standalone: true
})
export class ToUserProfileImagePipe implements PipeTransform {

  constructor(private contactApiService: ContactApiService) {

  }

  async transform(value: String): Promise<any> {
    let img = this.contactApiService.getUserProfileImage(value);
    return await lastValueFrom(img);
  }

}

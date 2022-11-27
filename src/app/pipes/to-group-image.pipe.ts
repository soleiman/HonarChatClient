import { Pipe, PipeTransform } from '@angular/core';
import { GroupApiService } from '../services/group-api.service';
import { lastValueFrom } from 'rxjs';

@Pipe({
  name: 'toGroupImage'
})
export class ToGroupImagePipe implements PipeTransform {

  constructor(private groupApiService: GroupApiService) {

  }

  async transform(value: String): Promise<any> {
    let res = this.groupApiService.getGroupImage(value);
    return await lastValueFrom(res);
  }

}

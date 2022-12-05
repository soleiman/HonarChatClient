import { Pipe, PipeTransform } from '@angular/core';
import { GroupApiService } from '../services/group-api.service';
import { lastValueFrom } from 'rxjs';

@Pipe({
  name: 'toGroupName',
  standalone: true
})
export class ToGroupNamePipe implements PipeTransform {

  constructor(private groupApiService: GroupApiService) {

  }

  async transform(value: String): Promise<any> {
    let name = this.groupApiService.getGroupName(value);
    return await lastValueFrom(name);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable  } from 'rxjs';
import { UserApiService } from './user-api.service';
import { environment } from '../../environment/environment';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupApiService {

  groupList$: BehaviorSubject<Group[]> = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient, userApiService: UserApiService) {
    userApiService.getCurrentUserObs().subscribe(user => {
      this.getUserGroups(user.mobileNumber)
        .subscribe(groups => {
          this.groupList$.next(groups);
        });
    });
  }

  getUserGroups = (user: string) => {
    return this.httpClient.get<Group[]>(environment.baseApiUrl + '/group/user-group/' + user);
  }

  createGroup = (group: Group) => {
    return this.httpClient.post(environment.baseApiUrl + '/group/create-group', group.createJSON());
  }

  getGroupName = (group_id: String) => {
    return this.httpClient.get<any>(environment.baseApiUrl + '/group/name/' + group_id);
  }

  getGroupImage = (group_id: String) => {
    return this.httpClient.get<any>(environment.baseApiUrl + '/group/image/' + group_id);
  }
}

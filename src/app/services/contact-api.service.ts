import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject  } from 'rxjs';
import { UserApiService } from './user-api.service';
import { environment } from '../../environment/environment';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactApiService {
  contactList$: BehaviorSubject<Contact[]> = new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient, userApiService: UserApiService) {
    userApiService.getCurrentUserObs().subscribe(user => {
      this.getUserContacts(user.mobileNumber)
        .subscribe(contacts => {
          this.contactList$.next(contacts);
        });
    });
  }

  getUserContacts(mobileNumber: String) {
    return this.httpClient.get<Contact[]>(environment.baseApiUrl + '/user/user-contacts/' + mobileNumber);
  }

  createContact = (contact: Contact) => {
    return this.httpClient.post(environment.baseApiUrl + '/user/create-contact', contact.toJSON());
  }

  getUserFullName = (mobileNumber: String) => {
    return this.httpClient.get<any>(environment.baseApiUrl + '/user/fullname/' + mobileNumber);
  }

  getUserProfileImage = (mobileNumber: String) => {
    return this.httpClient.get<any>(environment.baseApiUrl + '/user/profileimage/' + mobileNumber);
  }
}

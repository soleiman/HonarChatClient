import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject  } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Contact } from '../../models/contact.model';
import { StorageService } from 'src/app/services/storage.service';


@Injectable()
export class ContactApiService {
  contactList$: BehaviorSubject<Contact[]> = new BehaviorSubject<any>(null);
  user: any;
  constructor(private httpClient: HttpClient, private storage: StorageService) {
    this.storage.currentUser$.subscribe(user => {
      this.user = user;
      this.fillUserContacts();
    });
  }

  fillUserContacts = () => {
    if(this.user)
      this.getUserContacts(this.user.mobile_number)
        .subscribe(contacts => {
          this.contactList$.next(contacts);
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

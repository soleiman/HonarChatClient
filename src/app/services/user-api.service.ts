import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable  } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private currentUser: User = new User("1", "09399292940", "سلیمان شریفی", "/assets/img/avatars/6.jpg", new Date());

  private currentUser$: BehaviorSubject<User> = new BehaviorSubject<User>(this.currentUser);

  constructor(http: HttpClient) {

  }

  getCurrentUserObs(): Observable<User> {
    return this.currentUser$.asObservable();
  }

  setCurrentUserObs(user: User) {
    this.currentUser$.next(user);
  }

}

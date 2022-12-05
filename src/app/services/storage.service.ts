import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environment/environment';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  currentUser$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userSaved$: Subject<Boolean> = new Subject<Boolean>();

  constructor(private http: HttpClient) {
    this.userSaved$.next(false);
    if(this.isLoggedIn()) {
      this.getUser().subscribe(user => this.currentUser$.next(user));
      this.userSaved$.next(true);
    }
  }

  clean(): void {
    window.sessionStorage.clear();
  }

  uploadAvatar = (fileList:FileList, avatarId: String, isGroup: Boolean) => {
    var formData: any = new FormData();
    formData.append('avatar', fileList[0] as File);
    formData.append('avatarId', avatarId);
    formData.append('isGroup', isGroup);
    
    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.http.post(environment.baseApiUrl + '/avatar/upload-avatar', formData, { headers: headers });
  }

  public saveUser(user: any): Observable<boolean> {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log('[USER SAVED]');
    this.currentUser$.next(user);
    return of(true);
  }

  public getUser(): Observable<any> {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return of(JSON.parse(user));
    }

    return of({});
  }

  getToken = () => {
    const user = window.sessionStorage.getItem(USER_KEY);

    if (user) {
      let data = JSON.parse(user);
      return data.token;
    }
  }

  getRefreshToken = () => {
    const user = window.sessionStorage.getItem(USER_KEY);

    if (user) {
      let data = JSON.parse(user);
      return data.refresh_token;
    }
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
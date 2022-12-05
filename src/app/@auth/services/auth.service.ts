import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage.service';

const AUTH_API = 'http://localhost:3001/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  login(mobile_number: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'login',
      {
        mobile_number,
        password,
      },
      httpOptions
    );
  }

  register(mobile_number: string, full_name: string, password: string, profile_image: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        full_name,
        mobile_number,
        password,
        profile_image
      },
      httpOptions
    );
  }

  refreshToken(): Observable<any> {
    
    let mobile_number = '';

    this.storage.getUser().subscribe({
      next: user => {
        mobile_number = user.mobile_number;
      }
    });

    return this.http.post(
      AUTH_API + 'refresh-token',
      {
        mobile_number: mobile_number,
        refresh_token: this.storage.getRefreshToken()
      },
      httpOptions
    );
  }
}
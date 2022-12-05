import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import { StorageService } from '../services/storage.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

    constructor(private router: Router, private storage: StorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(tap({
            next: x => {},
            error: err => { 
                if (err.status !== 401) {
                    return;
                }
                this.storage.clean();
                this.router.navigateByUrl('/login');
             },
        }));
    }
}

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StorageService } from "../services/storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private storage: StorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.storage.getToken();
    if(token !== undefined && token !== null){
      req = req.clone({
        setHeaders: {
          // "Content-Type": "application/json; charset=utf-8",
          // "Accept": "application/json",
          "x-access-token": token,
        },
      });
    }
    return next.handle(req);
  }
}

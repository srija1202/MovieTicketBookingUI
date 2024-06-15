import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {



  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var token = localStorage.getItem('accessToken');
    if (token != null) {
      const tokenizeReq = request.clone({
        headers: request.headers.set('Authorization', `bearer ${token}`),
      });
      return next.handle(tokenizeReq);
    }

    return next.handle(request);
  }
}

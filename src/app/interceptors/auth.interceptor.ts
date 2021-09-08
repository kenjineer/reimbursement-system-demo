import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('token');

    if (idToken) {
      let cloned = req.clone({
        headers: req.headers.set('Authorization', idToken),
      });

      if (req.body?.files) {
        cloned = cloned.clone({
          headers: req.headers.append('Content-Type', 'multipart/form-data'),
        });
      }

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}

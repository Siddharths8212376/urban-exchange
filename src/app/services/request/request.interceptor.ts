import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { LoaderService } from '../loader/loader.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }
  pendingReqCount: number = 0;
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let lastResponse: HttpEvent<any>;
    let error: HttpErrorResponse;
    this.loaderService.start();
    this.pendingReqCount++;
    return next.handle(request).pipe(
      tap((response: HttpEvent<any>) => {
        lastResponse = response;
        if (this.pendingReqCount > 0) this.pendingReqCount--;
      }),
      catchError((err: any) => {
        error = err;
        return throwError(err);
      }),
      finalize(() => {
        if (lastResponse.type === HttpEventType.Sent && !error) {
          this.loaderService.stop();
        }
        if (this.pendingReqCount == 0) {
          this.loaderService.stop();
        }
      }));
  }
}

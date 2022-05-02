import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast/toast.service';
import { GetCurrencyService } from 'src/app/modules/currency/service/get-currency.service';

@Injectable()
export class CoreInterceptor implements HttpInterceptor {

  currency : string = "bs";

  constructor(private router : Router,
              private toastService : ToastService,
              private currencyService : GetCurrencyService){

    this.currencyService.currencyObservable.subscribe(data => {
      if(data != null && data){
        this.currency = data.currency;
      }
    })
  }


  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const Authorization = localStorage.getItem('Authorization');
    const XRefresh = localStorage.getItem('X-Refresh');
    let divisa = localStorage.getItem('divisa');
    let request = httpRequest;
    let path = request.url.split("/api")[1];

    if(!divisa){
      divisa = "bs";
    }

    if(Authorization && XRefresh){
      request = httpRequest.clone({
        setHeaders: {
          'Authorization' : Authorization,
          'X-Refresh' : XRefresh,
          'gateway' : '1',
          'currency' : divisa
        }
      });
    }else{
      request = httpRequest.clone({
        setHeaders: {
          'gateway' : '1',
          'currency' : divisa
        }
      })
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err.error.code === 211){
          this.toastService.showToast('banplus-info-dark', 'ALERTA' , 'Su sesión ha expirado' , 4000);
          localStorage.removeItem('Authorization');
          this.router.navigateByUrl('auth/login');
        }
        return throwError( err );
      }))
  }
}

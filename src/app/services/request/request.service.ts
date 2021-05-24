import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs/index';
import {CookieService} from 'ngx-cookie-service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Personne } from 'src/app/models/personne';
import { TokenService } from '../token/token.service';


@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private router: Router, private http: HttpClient, private Cookie: CookieService, private tokenService: TokenService) { }

    http_simple_request(personne: Personne, url: String): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin':'*',
            })
          };
        return this.http.post(environment.backend + url, personne, httpOptions);
    }


    http_get_request() {

        this.checkCredentials();


        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': 'Bearer ' + this.tokenService.getAccessToken().accessToken
            })
        };

        return httpOptions;
    }


    checkCredentials() {
        if (!this.Cookie.check('access_token')) {
           this.logout();
        }
    }


    logout() {
        this.Cookie.delete('access_token', '/');
        this.Cookie.delete('user', '/');
        this.router.navigate(['/login']);
    }


}

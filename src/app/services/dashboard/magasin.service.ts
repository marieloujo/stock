import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Magasin} from '../../models/magasin';
import { CookieService } from 'ngx-cookie-service';
import { Token } from 'src/app/models/token.model';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class MagasinService {

  url: string = environment.backend +'/magazin'

  constructor(
    private http: HttpClient, private Cookie: CookieService, private router: Router
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`, this.http_get_request());
  }

  createMagasin(magasin: Magasin): Observable<Object> {
    return this.http.post(`${this.url}/creer-magazin`, magasin, this.http_get_request());
  }

  updateMagasin(magasin: Magasin): Observable<Object> {
    return this.http.put(`${this.url}/modifier-magazin`, magasin, this.http_get_request());
  }

  deleteMagasin(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-magazin/${id}`, this.http_get_request());
  }


    http_get_request() {

        this.checkCredentials();


        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': 'Bearer ' + this.getAccessToken().accessToken
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

    getAccessToken(): Token {
        let token = new Token();
        token = JSON.parse(this.Cookie.get('access_token'));
    
        return token;
    }

}

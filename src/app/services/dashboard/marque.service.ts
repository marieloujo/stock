import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Marque} from '../../models/marque';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Token } from 'src/app/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  url: string = environment.backend +'/marque'

  constructor(
    private http: HttpClient, private Cookie: CookieService, private router: Router
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`, this.http_get_request());
  }

  createMarque(marque: Marque): Observable<Object> {
    return this.http.post(`${this.url}/creer-marque`, marque, this.http_get_request());
  }

  updateMarque(marque: Marque): Observable<Object> {
    return this.http.put(`${this.url}/modifier-marque`, marque, this.http_get_request());
  }

  deleteMarque(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-marque/${id}`, this.http_get_request());
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

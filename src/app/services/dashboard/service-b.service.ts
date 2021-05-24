import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Profil} from '../../models/profil';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServiceB} from '../../models/service-b';
import { RequestService } from '../request/request.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Token } from 'src/app/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceBService {

  url: string = environment.backend +'/service';

  constructor(
    private http: HttpClient, private Cookie: CookieService, private router: Router
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`, this.http_get_request());
  }

  createService(serviceB: ServiceB): Observable<Object> {
    return this.http.post(`${this.url}/creer-service`, serviceB, this.http_get_request());
  }

  updateService(serviceB: ServiceB): Observable<Object> {
    return this.http.put(`${this.url}/modifier-service`, serviceB, this.http_get_request());
  }

  deleteService(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-service/${id}`, this.http_get_request());
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

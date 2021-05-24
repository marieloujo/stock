import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Marque} from '../../models/marque';
import {Produit} from '../../models/produit';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Token } from 'src/app/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  url: string = environment.backend +'/produit'

  constructor(
    private http: HttpClient, private Cookie: CookieService, private router: Router
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`, this.http_get_request());
  }

  createProduit(produit: Produit): Observable<Object> {
    return this.http.post(`${this.url}/creer-produit`, produit, this.http_get_request());
  }

  updateProduit(produit: Produit): Observable<Object> {
    return this.http.put(`${this.url}/modifier-produit`, produit, this.http_get_request());
  }

  deleteProduit(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-produit/${id}`, this.http_get_request());
  }

  getProduitById(id: number): Observable<Object> {
    return this.http.get(`${this.url}/get-by-id/${id}`, this.http_get_request());
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

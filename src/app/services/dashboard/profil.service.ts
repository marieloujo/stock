import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Profil } from 'src/app/models/profil';
import { Token } from 'src/app/models/token.model';
import { environment } from 'src/environments/environment';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  url: string = environment.backend +'/profil';

  constructor(
    private http: HttpClient, private Cookie: CookieService, private router: Router
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`, this.http_get_request());
  }

  createProfil(profil: Profil): Observable<Object> {
    return this.http.post(`${this.url}/creer-profil`, profil, this.http_get_request());
  }

  updateProfil(profil: Profil): Observable<Object> {
    return this.http.put(`${this.url}/modifier-profil`, profil, this.http_get_request());
  }

  deleteProfil(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-profil/${id}`, this.http_get_request());
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

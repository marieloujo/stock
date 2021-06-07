import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Magasin} from '../../models/magasin';
import {Demande} from '../../models/demande';
import { RequestService } from '../request/request.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Token } from 'src/app/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  url: string = environment.backend +'/demande'

  constructor(
    private http: HttpClient, private Cookie: CookieService, private router: Router
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`, this.http_get_request());
  }


  createDemande(demande: Demande, file: File): Observable<Object> {

    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('demande', JSON.stringify(demande));
    

    return this.http.post(`${this.url}/creer-demande`, formData, this.http_multipart_request());

  }


  downloadDocument(filename: string): Observable<any> { // télécharger fichier 
    return this.http.get(`${this.url}/file/download/${filename}` , this.getHttpDownloadHeaderForResource());
 }


  updateDemande(demande: Demande): Observable<Object> {
    return this.http.put(`${this.url}/modifier-demande`, demande, this.http_get_request());
  }

  deleteDemande(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-demande/${id}`, this.http_get_request());
  }

  getDemandeById(id: number): Observable<Object> {
    return this.http.get(`${this.url}/get-by-id/${id}`, this.http_get_request());
  }

  getStatsDayWeekMonthYear(): Observable<Object> {
    return this.http.get(`${this.url}/getStats-day-week-mounth-year`, this.http_get_request());
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

    console.log(httpOptions);

    return httpOptions;
}


http_multipart_request() {

    this.checkCredentials();


    const httpOptions = {
        headers: new HttpHeaders({
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

getHttpDownloadHeaderForResource() { 
    this.checkCredentials();

    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.getAccessToken().accessToken
        }),
        responseType: 'blob' as 'json'
    };

    console.log(httpOptions);

    return httpOptions;
}



}

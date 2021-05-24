import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Magasin} from '../../models/magasin';
import {Gamme} from '../../models/gamme';

@Injectable({
  providedIn: 'root'
})
export class GammeService {

  url: string = environment.backend +'/gamme'

  constructor(
    private http: HttpClient
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

  createGamme(gamme: Gamme): Observable<Object> {
    return this.http.post(`${this.url}/creer-gamme`, gamme);
  }

  updateGamme(gamme: Gamme): Observable<Object> {
    return this.http.put(`${this.url}/modifier-gamme`, gamme);
  }

  deleteGamme(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-gamme/${id}`);
  }

  getGammeById(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/get-by-id/${id}`);
  }

}

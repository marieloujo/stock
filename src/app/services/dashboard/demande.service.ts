import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Magasin} from '../../models/magasin';
import {Demande} from '../../models/demande';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  url: string = environment.backend +'/demande'

  constructor(
    private http: HttpClient
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

  createDemande(demande: Demande): Observable<Object> {
    return this.http.post(`${this.url}/creer-demande`, demande);
  }

  updateDemande(demande: Demande): Observable<Object> {
    return this.http.put(`${this.url}/modifier-demande`, demande);
  }

  deleteDemande(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-demande/${id}`);
  }

  getDemandeById(id: number): Observable<Object> {
    return this.http.get(`${this.url}/get-by-id/${id}`);
  }

  getStatsDayWeekMonthYear(): Observable<Object> {
    return this.http.get(`${this.url}/getStats-day-week-mounth-year `);
  }

}

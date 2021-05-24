import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DemandeProduit} from '../../models/demande-produit';

@Injectable({
  providedIn: 'root'
})
export class DemandeProduitService {

  url: string = environment.backend +'/demande-produit'

  constructor(
    private http: HttpClient
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`);
  }

  createDemandeProduit(demandeProduit: DemandeProduit): Observable<Object> {
    return this.http.post(`${this.url}/creer-demande-produit`, demandeProduit);
  }

  updateDemandeProduit(demandeProduit: DemandeProduit): Observable<Object> {
    return this.http.put(`${this.url}/modifier-demande-produit`, demandeProduit);
  }

  deleteDemandeProduit(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-demande-produit/${id}`);
  }

  getListDescCreateDate(): Observable<Object> {
    return this.http.get(`${this.url}/list/desc-create-date`);
  }

  getDemandeProduitCreatedBy(id: number): Observable<Object> {
    return this.http.get(`${this.url}/demande-produit-createdBy/${id}`);
  }

}

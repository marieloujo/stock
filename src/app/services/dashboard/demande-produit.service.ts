import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DemandeProduit} from '../../models/demande-produit';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class DemandeProduitService {

  url: string = environment.backend +'/demande-produit'

  constructor(
    private http: HttpClient, private requestService: RequestService
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list`, this.requestService.http_get_request());
  }

  createDemandeProduit(demandeProduit: DemandeProduit): Observable<Object> {
    return this.http.post(`${this.url}/creer-demande-produit`, demandeProduit, this.requestService.http_get_request() );
  }

  updateDemandeProduit(demandeProduit: DemandeProduit): Observable<Object> {
    return this.http.put(`${this.url}/modifier-demande-produit`, demandeProduit, this.requestService.http_get_request());
  }

  deleteDemandeProduit(id: number): Observable<Object> {
    return this.http.delete(`${this.url}/supprimer-demande-produit/${id}`, this.requestService.http_get_request());
  }

  getListDescCreateDate(): Observable<Object> {

    return this.http.get(`${this.url}/list/desc-create-date`, this.requestService.http_get_request());

  }

  getDemandeProduitCreatedBy(id: number): Observable<Object> {
    return this.http.get(`${this.url}/demande-produit-createdBy/${id}`, this.requestService.http_get_request());
  }


}

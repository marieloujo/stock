import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class MouvementService {

  url: string = environment.backend +'/common'

  constructor(
    private http: HttpClient, private request: RequestService
  ) { }

  getList(): Observable<Object> {
    return this.http.get(`${this.url}/list-mouvement`, this.request.http_get_request());
  }

}

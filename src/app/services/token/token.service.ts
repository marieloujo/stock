import { Injectable } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { Token } from 'src/app/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) { }


    saveToken(token) { // save the token in storage
        const expireDate = new Date().getTime() + (1000 * 10);
        console.log(JSON.stringify(token));

        this.cookieService.set('access_token', JSON.stringify(token), expireDate, '/');
    }

    getAccessToken(): Token {
        let token = new Token();
        token = JSON.parse(this.cookieService.get('access_token'));
    
        return token;
    }

    deleteToken() {
        this.cookieService.delete('access_token');
    }

}
 
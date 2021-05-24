import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Token } from './models/token.model';
import { TokenService } from './services/token/token.service';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    environnement = environment;
    token: Token;
  
    constructor(private router: Router, private tokenService: TokenService) { }

    canActivate() {

        this.token = this.tokenService.getAccessToken();

        if (this.token !== null) {
            return this.canAccess();
            //return false;
        }
        // not logged in so redirect to login page
        this.tokenService.deleteToken();
        this.router.navigate(['/login']);
        return false;
    }


    isAdmin(): boolean {
        return this.token.roles.indexOf(environment.ROLE_ADMIN) > -1;
    }


    isDemandeur(): boolean {
        return this.token.roles.indexOf(environment.ROLE_DEMANDEUR) > -1;
    }


    isGestionnaire(): boolean {
        return this.token.roles.indexOf(environment.ROLE_GESTIONNAIRE) > -1;
    }

    isValidateur(): boolean {
        return this.token.roles.indexOf(environment.ROLE_VALIDATEUR) > -1;
    }


    canAccess(): boolean {
        return this.isAdmin() || this.isDemandeur() || this.isGestionnaire() || this.isValidateur();
    }

  
}

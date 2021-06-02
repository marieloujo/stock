import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import { RequestService } from 'src/app/services/request/request.service';
import { Personne } from 'src/app/models/personne';
import { TokenService } from 'src/app/services/token/token.service';
import { Token } from 'src/app/models/token.model';
import { NgxSpinnerService } from "ngx-spinner";

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm!: FormGroup;

  formSubmitted = false;
  erreur_interne = false;
  login_echec = false;

  constructor(
      private formBuilder: FormBuilder, 
      private router: Router, 
      private requestService: RequestService, 
      private Cookie: CookieService,
      private tokenService: TokenService,
      private spinner: NgxSpinnerService) { 

    this.validateForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

  }

  ngOnInit(): void {
      if (this.tokenService.getAccessToken() !== null ) {
          this.router.navigate(['dashboard']);
      }
  }

  submitForm(): void { // formulaire valider

    this.spinner.show();
    this.formSubmitted = true;
    this.erreur_interne = false;
    this.login_echec = false;

    if (this.validateForm.valid ) {
      let user = new Personne();

      user.username = this.validateForm.get('username').value;
      user.password = this.validateForm.get('password').value;
      this.login(user);

    }


  }
    login(user: Personne) {
        this.requestService.http_simple_request(user, '/api/auth/login').subscribe({
            next: value => { // success
                this.erreur_interne = false;

                let token = new Token();
                token = value;
                console.log(token);

                let role_personne = true;

                token.roles.forEach(role => {
                    if(role != environment.ROLE_PERSONNE) {
                        role_personne = false;
                    }
                });

                if (role_personne) {
                    this.router.navigate(['/unauthorize']);
                } else {
                    this.tokenService.saveToken(value);
                    this.resetLoginForm();
                    this.router.navigate(['/dashboard']);
                }

            },
            error: err => { // erreur
                this.login_echec = true;
                this.validateForm.get('password').setValue('');
                this.spinner.hide();
            },
            complete: () => { // fin de la requete
                this.spinner.hide();
            }
        });
    } 

    resetLoginForm() { // reset login form
        this.validateForm.reset({username: '', password: ''});
        this.formSubmitted = false;
        this.login_echec = false;
    }






}

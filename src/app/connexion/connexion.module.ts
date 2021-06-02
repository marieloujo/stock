import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConnexionRoutingModule } from './connexion-routing.module';
import {ConnexionComponent} from './connexion.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {ReactiveFormsModule} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';


import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [ConnexionComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent],
  imports: [
      NgxSpinnerModule,
    CommonModule,
    ConnexionRoutingModule,
    NzInputModule,
    NzGridModule,
    ReactiveFormsModule,
    NzButtonModule
  ]
})
export class ConnexionModule { }

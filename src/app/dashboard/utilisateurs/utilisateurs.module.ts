import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilisateursRoutingModule } from './utilisateurs-routing.module';
import { UtilisateursComponent } from './utilisateurs.component';
import { ProfilComponent } from './profil/profil.component';
import { ServiceComponent } from './service/service.component';
import { UserRunComponent } from './user-run/user-run.component';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {RouterModule} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { SharingModule } from 'src/app/sharing/sharing.module';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzDividerModule} from 'ng-zorro-antd/divider';

import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  declarations: [UtilisateursComponent, ProfilComponent, ServiceComponent, UserRunComponent],
  imports: [
      NgxSpinnerModule,
    CommonModule,
    UtilisateursRoutingModule,
    NzLayoutModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzMenuModule,
    RouterModule,
    SharingModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzSpaceModule,
    NzFormModule,
    NzRadioModule,
    NzGridModule,
    NzInputModule,
    NzTabsModule,
    NzTableModule,
    NzSelectModule,
    NzBadgeModule,
    NzPopconfirmModule,
    FormsModule,
    NzPaginationModule,
    NzDropDownModule,
    NzModalModule,
    NzDividerModule,
  ]
})
export class UtilisateursModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {RouterModule} from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import {SharingModule} from '../sharing/sharing.module';
import { MagasinComponent } from './magasin/magasin.component';
import { NouvelleDemandeComponent } from './nouvelle-demande/nouvelle-demande.component';
import { AproposComponent } from './apropos/apropos.component';
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
import { HistoriqueDemandeComponent } from './historique-demande/historique-demande.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {NzDescriptionsModule} from 'ng-zorro-antd/descriptions';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';

import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [DashboardComponent, AccueilComponent, MagasinComponent, NouvelleDemandeComponent, AproposComponent, HistoriqueDemandeComponent],
  imports: [
      NgxSpinnerModule,
    CommonModule,
    DashboardRoutingModule,
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
    NzDrawerModule,
    NzDescriptionsModule,
    NzCardModule,
    NzDatePickerModule,
  ]
})
export class DashboardModule { }

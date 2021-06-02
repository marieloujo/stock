import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterielRoutingModule } from './materiel-routing.module';
import {MaterielComponent} from './materiel.component';
import { MarqueComponent } from './marque/marque.component';
import { ModeleComponent } from './modele/modele.component';
import { GammeComponent } from './gamme/gamme.component';
import { EtatComponent } from './etat/etat.component';
import { ProduitComponent } from './produit/produit.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import { NgxSpinnerModule } from "ngx-spinner";


@NgModule({
  declarations: [MaterielComponent, MarqueComponent, ModeleComponent, GammeComponent, EtatComponent, ProduitComponent],
  imports: [
    NgxSpinnerModule,
    CommonModule,
    MaterielRoutingModule,
    ReactiveFormsModule,
    NzGridModule,
    NzTabsModule,
    NzSpaceModule,
    NzTableModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzLayoutModule,
    NzIconModule,
    FormsModule,
    NzSelectModule,
    NzPopconfirmModule,
    NzAlertModule,
    NzDropDownModule,
    NzModalModule,
    NzDividerModule,
    NzPaginationModule,
  ]
})
export class MaterielModule { }

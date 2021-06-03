import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from '../dashboard.component';
import {AccueilComponent} from '../accueil/accueil.component';
import {MagasinComponent} from '../magasin/magasin.component';
import {NouvelleDemandeComponent} from '../nouvelle-demande/nouvelle-demande.component';
import {AproposComponent} from '../apropos/apropos.component';
import {HistoriqueDemandeComponent} from '../historique-demande/historique-demande.component';
import {UtilisateursComponent} from './utilisateurs.component';
import {ProfilComponent} from './profil/profil.component';
import {ServiceComponent} from './service/service.component';
import {UserRunComponent} from './user-run/user-run.component';

const routes: Routes = [

  {
    path: '', component: UtilisateursComponent,
    children: [
      /*{
        path: 'profil',
        component: ProfilComponent,
      },*/
      {
        path: 'service',
        component: ServiceComponent,
      },
      {
        path: 'user',
        component: UserRunComponent,
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateursRoutingModule { }

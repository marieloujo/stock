import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {AccueilComponent} from './accueil/accueil.component';
import {MagasinComponent} from './magasin/magasin.component';
import {NouvelleDemandeComponent} from './nouvelle-demande/nouvelle-demande.component';
import {AproposComponent} from './apropos/apropos.component';
import {HistoriqueDemandeComponent} from './historique-demande/historique-demande.component';
import { AuthGuard } from '../auth.guard';


const routes: Routes = [
  {
    path: '', component: DashboardComponent, canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        component: AccueilComponent,
      },
      {
        path: 'magasins',
        component: MagasinComponent,
      },
      {
        path: 'nouvelle-demande',
        component: NouvelleDemandeComponent,
      },
      {
        path: 'apropos',
        component: AproposComponent,
      },
      {
        path: 'historique-demande',
        component: HistoriqueDemandeComponent,
      },
      {
        path: 'materiel',
        loadChildren: () => import('./materiel/materiel.module').then(value => value.MaterielModule)
      },
      {
        path: 'utilisateur',
        loadChildren: () => import('./utilisateurs/utilisateurs.module').then(value => value.UtilisateursModule)
      },
      /*{
        path: 'sig',
        loadChildren: () => import('./sig/sig.module').then(value => value.SigModule)
      },*/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

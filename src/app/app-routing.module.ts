import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './error/error/error.component';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'dashboard', 
    loadChildren: () => import('./dashboard/dashboard.module').then(value => value.DashboardModule)
  },
  {
    path: '',
    loadChildren: () => import('./connexion/connexion.module').then(value => value.ConnexionModule)
  },
  {
      path: 'unauthorize',
      component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

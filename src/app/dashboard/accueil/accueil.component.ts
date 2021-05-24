import { Component, OnInit } from '@angular/core';
import {BehaviorService} from '../../services/common/behavior.service';
import {DemandeProduitService} from '../../services/dashboard/demande-produit.service';
import {DemandeProduit} from '../../models/demande-produit';
import {HttpErrorResponse} from '@angular/common/http';
import {ProduitService} from '../../services/dashboard/produit.service';
import {DemandeService} from '../../services/dashboard/demande.service';
import {Produit} from '../../models/produit';
import {Demande} from '../../models/demande';
import { TokenService } from 'src/app/services/token/token.service';
import { Token } from 'src/app/models/token.model';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  demandeProduitDescList: DemandeProduit[] = [];

  listOfColumn: any = [];
  listOfDisplayData;
  token: Token;
  environment = environment;
  livreur: boolean;
  validateur: boolean;


  constructor(
    private behaviorService: BehaviorService,
    private demandeProduitService: DemandeProduitService,
    private produitService: ProduitService,
    private demandeService: DemandeService,
    private tokenService: TokenService
  ) {
    this.token = this.tokenService.getAccessToken(); 
   }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Tableau de bord']);

    this.listDemandeProduitDescCreatedDate();

    this.listOfColumnHeader();

    this.livreur = this.canLivrer();
    this.validateur = this.canValider();
    console.log(this.livreur+" "+this.validateur)


  }


  canValider(): boolean {
    return this.token.roles.indexOf(environment.ROLE_VALIDATEUR) > -1;
  }


  canLivrer(): boolean {
    return this.token.roles.indexOf(environment.ROLE_GESTIONNAIRE) > -1;
}


  validerDemande(demandeProduit: DemandeProduit){

    demandeProduit.valider = true;

    this.demandeProduitService.updateDemandeProduit(demandeProduit).subscribe(
      (data: any) => {
        console.log('Demande Produit update ==>', data);

        this.listDemandeProduitDescCreatedDate();

      },
      (error: HttpErrorResponse) => {
        console.log('error demande Produit update ==>', error.message, ' ', error.status, ' ', error.statusText);
      });

  }

  livrerDemande(demandeProduit: DemandeProduit){

    demandeProduit.livrer = true;

    this.demandeProduitService.updateDemandeProduit(demandeProduit).subscribe(
      (data: any) => {
        console.log('Demande Produit update ==>', data);

        this.listDemandeProduitDescCreatedDate();

      },
      (error: HttpErrorResponse) => {
        console.log('error demande Produit update ==>', error.message, ' ', error.status, ' ', error.statusText);
      });

  }

  listDemandeProduitDescCreatedDate(){
    this.demandeProduitService.getListDescCreateDate().subscribe(
      (data: DemandeProduit[]) => {
        this.demandeProduitDescList = data;
        console.log('Demande Produit Desc Date ==>', this.demandeProduitDescList);

        for (let dmdProd of this.demandeProduitDescList){

          this.produitService.getProduitById(dmdProd.produit.id).subscribe(
            (dataProd: Produit) => {
              dmdProd.gamme = dataProd.gamme;
              dmdProd.marque = dataProd.marque;
              dmdProd.modele = dataProd.modele;
            },
            (error: HttpErrorResponse) => {
              console.log('error get by id Produit ==>', error.message, ' ', error.status, ' ', error.statusText);
            });

          this.demandeService.getDemandeById(dmdProd.demande.id).subscribe(
            (dataDem: Demande) => {
              dmdProd.personne =  dataDem.personne;
            },
            (error: HttpErrorResponse) => {
              console.log('error get by id Produit ==>', error.message, ' ', error.status, ' ', error.statusText);
            });

        }

        this.listOfDisplayData = [...this.demandeProduitDescList];

        console.log('DemandeProduit listOfDisplayData ==>', this.listOfDisplayData);

      },
      (error: HttpErrorResponse) => {
        console.log('error getList marque ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listOfColumnHeader(){
    this.listOfColumn = [
      {
        title: 'Numero Série',
        compare: null,
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.produit.numSerie.localeCompare(b.produit.numSerie),
        //sortFn: (a: DemandeProduit, b: DemandeProduit) => a.produit.numSerie - b.produit.numSerie,
      },
      {
        title: 'Equipement',
        compare: null,
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.produit.gamme.libelle.localeCompare(b.produit.gamme.libelle),
      },
      {
        title: 'Marque',
        compare: null,
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.produit.marque.libelle.localeCompare(b.produit.marque.libelle),
      },
      {
        title: 'Modele',
        compare: null,
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.produit.modele.libelle.localeCompare(b.produit.modele.libelle),
      },
      {
        title: 'Demandeur',
        compare: null,
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.demande.personne.nom.localeCompare(b.demande.personne.nom),
      },
      /*{
        title: 'Math Score',
        compare: (a: DataItem, b: DataItem) => a.math - b.math,
        priority: 2
      },
      {
        title: 'English Score',
        compare: (a: DataItem, b: DataItem) => a.english - b.english,
        priority: 1
      }*/
    ];
  }

}

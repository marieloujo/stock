import {Component, OnInit} from '@angular/core';
import {BehaviorService} from '../../services/common/behavior.service';
import {DemandeProduitService} from '../../services/dashboard/demande-produit.service';
import {ProduitService} from '../../services/dashboard/produit.service';
import {DemandeProduit} from '../../models/demande-produit';
import {Produit} from '../../models/produit';
import {HttpErrorResponse} from '@angular/common/http';
import {DemandeService} from '../../services/dashboard/demande.service';
import {Demande} from '../../models/demande';
import { TokenService } from 'src/app/services/token/token.service';
import { Token } from 'src/app/models/token.model';
import {environment} from '../../../environments/environment';

interface Historique {
  numserie: string;
  marque: string;
  modele: string;
  gamme: string;
  demandeur: string;
  date: string;
}

interface Detail {
  demandeur: string;
  date_demande: string;
  validateur: string;
  date_Validation: string;
  gestionnaire: string;
  date_sorti: string;
  destination: string;
  date_service: string;
}

@Component({
  selector: 'app-historique-demande',
  templateUrl: './historique-demande.component.html',
  styleUrls: ['./historique-demande.component.css']
})
export class HistoriqueDemandeComponent implements OnInit {


  listOfData: Historique[] = [
    {
      numserie: '1002DFB852',
      marque: 'DELL',
      modele: 'A80',
      gamme: 'Ecran',
      demandeur: 'Pierre HOUNDO',
      date: '04 mai 2021',
    },
    {
      numserie: '875EFG6924',
      marque: 'HP',
      modele: 'D40',
      gamme: 'Souris',
      demandeur: 'Samson CATRAYE',
      date: '04 mai 2021',
    },
    {
      numserie: '658ADCF87G',
      marque: 'CASIO',
      modele: 'CP55',
      gamme: 'Projecteur',
      demandeur: 'Jacob VIGANVI',
      date: '05 mai 2021',
    },
    {
      numserie: '201ASC568R',
      marque: 'CASIO',
      modele: 'RA8',
      gamme: 'Rallonge',
      demandeur: 'Jacob VIGANVI',
      date: '05 mai 2021',
    },

  ];

  listOfDetail: Detail[] = [
    {
      demandeur: 'Paul Sam',
      date_demande: '04 mai 2021',
      validateur: 'Samuel Ba',
      date_Validation: '04 mai 2021',
      gestionnaire: 'Pat Ba',
      date_sorti: '05 mai 2021',
      destination: 'Comptabilité',
      date_service: '14 mai 2021',
    },
    /*{
      demandeur: 'Mamane Po',
      date_demande: '04 mai 2021',
      validateur: 'Samuel Ba',
      date_Validation: '05 mai 2021',
      gestionnaire: 'Pat Ba',
      date_sorti: '05 mai 2021',
      destination: 'Comptabilité',
      date_service: '18 mai 2021',
    },*/
  ];

  isVisibleMiddle = false;

  demandeProduitList: DemandeProduit[] = [];

  listOfColumn: any = [];
  listOfDisplayData;

  visibleDrawer = false;

  token: Token;
  can_create: boolean;

  searchValueNumero = '';
  searchValueEquipement = '';
  searchValueMarque = '';
  searchValueModele = '';
  searchValueDemandeur = '';

  visibleNumero = false;
  visibleEquipement = false;
  visibleMarque = false;
  visibleModele = false;
  visibleDemandeur = false;

  constructor(
    private behaviorService: BehaviorService,
    private demandeProduitService: DemandeProduitService,
    private produitService: ProduitService,
    private demandeService: DemandeService,
    private tokenService: TokenService
  ) {
      this.token = tokenService.getAccessToken();
  }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Demande', 'Historique demande']);

    this.list();

    this.listOfColumnHeader();

    this.can_create = this.canCreate();

  }



  canCreate(): boolean {
      return (this.token.roles.indexOf(environment.ROLE_ADMIN) > -1) || (this.token.roles.indexOf(environment.ROLE_DEMANDEUR) > -1) || (this.token.roles.indexOf(environment.ROLE_VALIDATEUR) > -1)
  }


  showModalMiddle(): void {
    this.isVisibleMiddle = true;
  }

  handleOkMiddle(): void {
    console.log('click ok');
    this.isVisibleMiddle = false;
  }

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  list(): void {
    this.demandeProduitService.getList().subscribe(
      (data: DemandeProduit[]) => {
        this.demandeProduitList = data;
        console.log('DemandeProduit List ==>', this.demandeProduitList);

        for (let dmdProd of this.demandeProduitList){

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

        this.listOfDisplayData = [...this.demandeProduitList];

        console.log('DemandeProduit listOfDisplayData ==>', this.listOfDisplayData);

        //this.pageIndex = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('error getList DemandeProduit ==>', error.message, ' ', error.status, ' ', error.statusText);
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

  openDrawer(): void {
    this.visibleDrawer = true;
  }

  closeDrawer(): void {
    this.visibleDrawer = false;
  }

  /**
   * demande: Demandeur;
  description:	string;
  id: number;
  livrer: boolean;
  produit: Produit;
  valider: boolean;

  marque: Marque;
  modele: Modele;
  gamme: Gamme;
  personne: Personne;
   */

  resetNumero(): void {
    this.searchValueNumero = '';
    this.searchNumero();
  }

  searchNumero(): void {
    this.visibleNumero = false;
    this.listOfDisplayData = this.demandeProduitList.filter((item: DemandeProduit) => item.produit.numSerie.indexOf(this.searchValueNumero) !== -1);
  }

  resetEquipement(): void {
    this.searchValueEquipement = '';
    this.searchEquipement();
  }

  searchEquipement(): void {
    this.visibleEquipement = false;
    this.listOfDisplayData = this.demandeProduitList.filter((item: DemandeProduit) => item.gamme.libelle.indexOf(this.searchValueEquipement) !== -1);
  }

  resetMarque(): void {
    this.searchValueMarque = '';
    this.searchMarque();
  }

  searchMarque(): void {
    this.visibleMarque = false;
    this.listOfDisplayData = this.demandeProduitList.filter((item: DemandeProduit) => item.marque.libelle.indexOf(this.searchValueMarque) !== -1);
  }

  resetModele(): void {
    this.searchValueModele = '';
    this.searchModele();
  }

  searchModele(): void {
    this.visibleModele = false;
    this.listOfDisplayData = this.demandeProduitList.filter((item: DemandeProduit) => item.modele.libelle.indexOf(this.searchValueModele) !== -1);
  }

  resetDemandeur(): void {
    this.searchValueDemandeur = '';
    this.searchDemandeur();
  }

  searchDemandeur(): void {
    this.visibleDemandeur = false;
    this.listOfDisplayData = this.demandeProduitList.filter((item: DemandeProduit) => item.personne.nom.indexOf(this.searchValueDemandeur) !== -1 || item.personne.prenom.indexOf(this.searchValueDemandeur) !== -1);
  }

}

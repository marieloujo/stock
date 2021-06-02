import {Component, OnInit} from '@angular/core';
import {BehaviorService} from '../../services/common/behavior.service';
import {DemandeProduitService} from '../../services/dashboard/demande-produit.service';
import {ProduitService} from '../../services/dashboard/produit.service';
import {DemandeProduit} from '../../models/demande-produit';
import {Produit} from '../../models/produit';
import {HttpErrorResponse} from '@angular/common/http';
import {DemandeService} from '../../services/dashboard/demande.service';
import {Demande} from '../../models/demande';
import {TokenService} from 'src/app/services/token/token.service';
import {Token} from 'src/app/models/token.model';
import {environment} from '../../../environments/environment';
import {PersonneService} from '../../services/dashboard/personne.service';
import {Personne} from '../../models/personne';
import { NgxSpinnerService } from "ngx-spinner";

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

  descriptionCourante: string = '';
  urlCourante: String = '';
  demandeurCourant: string = '';
  dateDemandeCourant: string = '';
  dateValidationDateCourant: string = '';
  dateValidationTimeCourant: string = '';
  dateLivraisonDateCourant: string = '';
  dateLivraisonTimeCourant: string = '';
  validateurCourant: string = '';
  gestionnaireCourant: string = '';
  //dateDemandeCourantFormat: Date = new Date();
  dateDemandeCourantFormat: Date;

  isVisibleMiddle = false;

  demandeProduitList: DemandeProduit[] = [];
  personneByUsernameList: Personne[] = [];

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

  dateToShow: string = '';
  timeToShow: string = '';

  startDate: Date;
  endDate: Date;


  constructor(
    private behaviorService: BehaviorService,
    private demandeProduitService: DemandeProduitService,
    private produitService: ProduitService,
    private demandeService: DemandeService,
    private personneService: PersonneService,
    private tokenService: TokenService,
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
    return (this.token.roles.indexOf(environment.ROLE_ADMIN) > -1) || (this.token.roles.indexOf(environment.ROLE_DEMANDEUR) > -1) || (this.token.roles.indexOf(environment.ROLE_VALIDATEUR) > -1);
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

        for (let dmdProd of this.demandeProduitList) {

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
              dmdProd.personne = dataDem.personne;
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

  listOfColumnHeader() {
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
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.gamme.libelle.localeCompare(b.gamme.libelle),
      },
      {
        title: 'Marque',
        compare: null,
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.marque.libelle.localeCompare(b.marque.libelle),
      },
      {
        title: 'Modele',
        compare: null,
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.modele.libelle.localeCompare(b.modele.libelle),
      },
      {
        title: 'Personne concernée',
        compare: null,
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.personne.nom.localeCompare(b.personne.nom),
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


  

  openDrawer(data: DemandeProduit): void {

    
    this.descriptionCourante = data.description;
    this.urlCourante = data.demande.url;
    this.dateValidationDateCourant = new Date(data.validationDate).toLocaleDateString();
    this.dateValidationTimeCourant = new Date(data.validationDate).toLocaleTimeString();
    this.dateLivraisonDateCourant = new Date(data.dateLivraison).toLocaleDateString();
    this.dateLivraisonTimeCourant = new Date(data.dateLivraison).toLocaleTimeString();

    console.log(data.validateur);
    console.log(data.gestionnaire);

    if (data.validateur == null) {
      this.validateurCourant = 'Aucun validateur pour cette demande';
      this.gestionnaireCourant = 'Aucun gestionnaire pour cette demande';
    } else {
      if (data.gestionnaire != null) {

        this.personneService.getPersonneByUsername02(data.validateur, data.gestionnaire).subscribe(
          (dataPers: Personne[]) => {

            this.personneByUsernameList = [...dataPers];

            this.validateurCourant = this.personneByUsernameList[0].nom + ' ' + this.personneByUsernameList[0].prenom;
            this.gestionnaireCourant = this.personneByUsernameList[1].nom + ' ' + this.personneByUsernameList[1].prenom;

            /*console.log('taille de personneListByUsername ==> '+ this.personneByUsernameList.length);

            if (this.personneByUsernameList != null || this.personneByUsernameList.length > 0){

            }*/
          },
          (error: HttpErrorResponse) => {
            console.log('error get personne List  by username demande produit ==>', error.message, ' ', error.status, ' ', error.statusText);
          });
      } else {
        this.personneService.getPersonneByUsername01(data.validateur).subscribe(
          (dataPers: Personne) => {
            let persC: Personne = dataPers;
            this.validateurCourant = persC.nom + ' ' + persC.prenom;
            this.gestionnaireCourant = 'Aucun gestionnaire pour cette demande';

          },
          (error: HttpErrorResponse) => {
            console.log('error get personne List  by username demande produit ==>', error.message, ' ', error.status, ' ', error.statusText);
          });
      }
    }



    this.demandeProduitService.getDemandeProduitCreatedBy(data.id).subscribe(
      (dataDmdProd: string[]) => {

        console.log('string de demandeur');
        console.log(dataDmdProd);
        this.demandeurCourant = dataDmdProd[0];
        this.dateDemandeCourant = dataDmdProd[1];

        this.dateDemandeCourantFormat = new Date(this.dateDemandeCourant);
        //this.dateDemandeCourantFormat.toUTCString();

        this.dateToShow = this.dateDemandeCourantFormat.toLocaleDateString();
        this.timeToShow = this.dateDemandeCourantFormat.toLocaleTimeString();

        console.log('dateDemandeCourant ' + this.dateDemandeCourantFormat);
        console.log('dateDemandeCourant ' + this.dateDemandeCourant);

      },
      (error: HttpErrorResponse) => {
        console.log('error get string createdBy createdDate by id demande produit ==>', error.message, ' ', error.status, ' ', error.statusText);
      });

    this.visibleDrawer = true;
  }


  closeDrawer(): void {
    this.visibleDrawer = false;
  }

  /**
   * demande: Demandeur;
   description:  string;
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

  rechercherParDate(){

    console.log('start Day')
    console.log(this.startDate)

    console.log('end Day')
    console.log(this.endDate)

    let de = new Date(this.startDate);
    let de2 = new Date(this.endDate);
    let sd: string = de.getFullYear()+"-"+(de.getMonth()+1)+"-"+de.getDate();
    let ed: string = de2.getFullYear()+"-"+(de2.getMonth()+1)+"-"+de2.getDate();

    let ddd = new Date(sd);
    let ddd2 = new Date(ed);
    console.log(ddd);
    console.log(ddd2);
    console.log(sd);
    console.log(ed);
    //console.log(de.getUTCMonth()+1);

    this.demandeProduitService.getDemandeProduitBetweenCreatedDate(this.startDate, this.endDate).subscribe(
      (data: DemandeProduit[]) => {
        console.log('Dans le get demandeProduit between created date');
        console.log(data);
      },
      (error: HttpErrorResponse) => {
        console.log('Error in Get demandeProduit Between createdDate  non ok ' + error.status + '  ' + error.statusText + '  ' + error.message);
      }
    );

  }

}

import {Component, OnInit} from '@angular/core';
import {BehaviorService} from '../../services/common/behavior.service';
import {DemandeProduitService} from '../../services/dashboard/demande-produit.service';
import {ProduitService} from '../../services/dashboard/produit.service';
import {DemandeProduit} from '../../models/demande-produit';
import {Produit} from '../../models/produit';
import {Magasin} from '../../models/magasin';
import {HttpErrorResponse} from '@angular/common/http';
import {DemandeService} from '../../services/dashboard/demande.service';
import {Demande} from '../../models/demande';

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

  descriptionCourante: string ='';
  demandeurCourant: string = '';
  dateDemandeCourant: string = '';
  //dateDemandeCourantFormat: Date = new Date();
  dateDemandeCourantFormat: Date;

  constructor(
    private behaviorService: BehaviorService,
    private demandeProduitService: DemandeProduitService,
    private produitService: ProduitService,
    private demandeService: DemandeService,

  ) {
  }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Demande', 'Historique demande']);

    this.list();

    this.listOfColumnHeader();

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
        sortFn: (a: DemandeProduit, b: DemandeProduit) => a.produit.numSerie.toLowerCase().localeCompare(b.produit.numSerie.toLowerCase()),
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
        title: 'Personne concernée',
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

  dateToShow: string ='';
  timeToShow: string ='';

  openDrawer(data: DemandeProduit): void {
    this.descriptionCourante = data.description;

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

        console.log('dateDemandeCourant ' +this.dateDemandeCourantFormat);
        console.log('dateDemandeCourant '+this.dateDemandeCourant);

      },
      (error: HttpErrorResponse) => {
        console.log('error get string createdBy createdDate by id demande produit ==>', error.message, ' ', error.status, ' ', error.statusText);
      });


    this.visibleDrawer = true;
  }

  closeDrawer(): void {
    this.visibleDrawer = false;
  }

}

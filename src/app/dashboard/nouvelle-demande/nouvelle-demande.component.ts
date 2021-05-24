import {Component, OnInit} from '@angular/core';
import {BehaviorService} from '../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Produit} from '../../models/produit';
import {ProduitService} from '../../services/dashboard/produit.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Personne} from '../../models/personne';
import {PersonneService} from '../../services/dashboard/personne.service';
import {NewDemande} from '../../models/new-demande';
import {Marque} from '../../models/marque';
import {Demande} from '../../models/demande';
import {DemandeProduit} from '../../models/demande-produit';
import {MouvementService} from '../../services/common/mouvement.service';
import {Mouvement} from '../../models/Mouvement';
import {DemandeService} from '../../services/dashboard/demande.service';
import {DemandeProduitService} from '../../services/dashboard/demande-produit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nouvelle-demande',
  templateUrl: './nouvelle-demande.component.html',
  styleUrls: ['./nouvelle-demande.component.css']
})
export class NouvelleDemandeComponent implements OnInit {

  validateNewDemandeForm!: FormGroup;

  produitList: Produit[];
  personneList: Personne[];
  newDemandeList: NewDemande[];
  mouvementList: Mouvement[];
  demandeProduitList: DemandeProduit[] = [];

  produitChoice: Produit;
  personneDemande: Personne;
  mouvementDemande: any;

  modele: string;
  gamme: string;
  marque: string;

  indexOfTab: number;

  listOfColumn: any = [];

  countNew: number = 0;

  

  constructor(
    private behaviorService: BehaviorService,
    private produitService: ProduitService,
    private personneService: PersonneService,
    private mouvementService: MouvementService,
    private demandeService: DemandeService,
    private demandeProduitService: DemandeProduitService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Demande', 'Nouvelle demande']);

    this.makeDemandeForm(null);

    this.listProduit();

    this.listPersonne();

    this.listOfColumnHeader();

    this.listMouvement();

  }

  listProduit(): void {
    this.produitService.getList().subscribe(
      (data: Produit[]) => {
        this.produitList = [...data];
        console.log('Produit List ==>', this.produitList);
        //this.listOfDisplayData = [...this.produitList];
        //this.pageIndex = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Produit ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listMouvement(): void {
    this.mouvementService.getList().subscribe(
      (data: Mouvement[]) => {
        this.mouvementList = [...data];
        console.log('Mouvement List ==>', this.mouvementList);

      },
      (error: HttpErrorResponse) => {
        console.log('error getList Mouvement ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  /*makeDemandeForm(produit: Produit, demande: Demande){
    this.validateNewDemandeForm = this.fb.group({
      //id: [produit != null ? produit.id : null],
      numSerie: [produit != null ? produit.numSerie : null,
        [Validators.required]],
      modele: [produit != null ? produit.modele : null,
        [Validators.required]],
      marque: [produit != null ? produit.marque : null,
        [Validators.required]],
      gamme: [produit != null ? produit.gamme : null,
        [Validators.required]],
      personne: [demande != null ? demande.personne : null,
        [Validators.required]],
      description: [produit != null ? produit.description : null],

    });
  }*/

  makeDemandeForm(demandeProduit: DemandeProduit) {
    this.validateNewDemandeForm = this.fb.group({
      id: [demandeProduit != null ? demandeProduit.id : null],
      produit: [demandeProduit != null ? demandeProduit.produit : null,
        [Validators.required]],
      demande: [demandeProduit != null ? demandeProduit.demande : null],
      personne: [demandeProduit != null ? demandeProduit.demande.personne : null,
        [Validators.required]],
      description: [demandeProduit != null ? demandeProduit.description : null],
      valider: [demandeProduit != null ? demandeProduit.valider : null],
      livrer: [demandeProduit != null ? demandeProduit.livrer : null],
      mouvement: [demandeProduit != null ? demandeProduit.demande.mouvement : null],
    });
  }

  resetDemandeForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateNewDemandeForm.reset();
    for (const key in this.validateNewDemandeForm.controls) {
      this.validateNewDemandeForm.controls[key].markAsPristine();
      this.validateNewDemandeForm.controls[key].updateValueAndValidity();
    }
    this.makeDemandeForm(null);
    this.indexOfTab = 0;
    //this.pageIndex = 1;
  }

  listPersonne(): void {
    this.personneService.getList().subscribe(
      (data: Personne[]) => {
        this.personneList = [...data];
        console.log('Personne List ==>', this.personneList);
        //this.listOfDisplayData = [...this.produitList];
        //this.pageIndex = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Personne ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  loadDetailProduit() {
    /*this.marque = this.produitChoice.marque.libelle;
    this.gamme = this.produitChoice.gamme.libelle;
    this.modele = this.produitChoice.modele.libelle;*/

    const produitToChoice = this.validateNewDemandeForm.get('produit').value;

    this.marque = produitToChoice.marque.libelle;
    this.gamme = produitToChoice.gamme.libelle;
    this.modele = produitToChoice.modele.libelle;

    console.log(this.marque);
    console.log(this.gamme);
    console.log(this.modele);

    console.log(produitToChoice);

  }

  validerProduit() {
    //this.indexOfTab = 1;

    for (const i in this.validateNewDemandeForm.controls) {
      this.validateNewDemandeForm.controls[i].markAsDirty();
      this.validateNewDemandeForm.controls[i].updateValueAndValidity();
    }

    if (this.validateNewDemandeForm.valid) {

      const formData = this.validateNewDemandeForm.value;
      this.personneDemande = formData.personne;
      this.mouvementDemande = formData.mouvement;
      formData.valider = false;
      formData.livrer = false;
      console.log('FormData -- Formulaire valide');
      console.log(formData);
      if (formData.id == null) {
        this.demandeProduitList.push(formData);
        this.demandeProduitList = [...this.demandeProduitList];
        console.log('demandeProduitList ==> ');
        console.log(this.demandeProduitList);

        this.makeDemandeForm(null);
      }
    }
    this.countNew++;
  }

  goToListDemandeProduit() {
    this.indexOfTab = 1;
  }

  addNewProduit() {
    this.indexOfTab = 0;
  }

  faireValiderProduit(){

    let demande: Demande = new Demande();
    let produitList =  this.demandeProduitList;


    demande.mouvement = this.mouvementDemande;
    demande.dateHeure = new Date();
    demande.personne = this.personneDemande;
    demande.valider = false;

    let newDemande: Demande = new Demande();

    this.demandeService.createDemande(demande).subscribe(
      (data: any) => {
      console.log('Enregistrement demande => '+JSON.stringify(data));
      newDemande = data;

      let theDemandeProduit: DemandeProduit = new DemandeProduit();


      for (let dp of produitList){
        theDemandeProduit.description = dp.description;
        theDemandeProduit.livrer = dp.livrer;
        theDemandeProduit.valider = dp.valider;
        theDemandeProduit.produit = dp.produit;
        theDemandeProduit.demande = data;

        this.demandeProduitService.createDemandeProduit(theDemandeProduit).subscribe(
          (data1: any) => {
            console.log("Enregistrement demandeProduit => "+JSON.stringify(data1));
          },
          (error: HttpErrorResponse) => {
            console.log("Enregistrement demandeProduit non effectuer => "+ error.message);
          }
        );

      }

    },
    (error: HttpErrorResponse) => {
      console.log('Enregistrement demande non effectué .. error => '+error.message);
    }
    );

    this.demandeProduitList = [];
    this.router.navigate(['/dashboard']).then(() => {
        window.location.reload();
    });

  }


  listOfColumnHeader() {
    this.listOfColumn = [
      {
        title: 'Numero Série',
        compare: null,
        sortFn: (a: Produit, b: Produit) => a.numSerie.localeCompare(b.numSerie),
        //sortFn: (a: Produit, b: Produit) => a.numSerie - b.numSerie,
      },
      {
        title: 'Marque',
        compare: null,
        sortFn: (a: Produit, b: Produit) => a.marque.libelle.localeCompare(b.marque.libelle),
      },
      {
        title: 'Modele',
        compare: null,
        sortFn: (a: Produit, b: Produit) => a.modele.libelle.localeCompare(b.modele.libelle),
      },
      {
        title: 'Equipement',
        compare: null,
        sortFn: (a: Produit, b: Produit) => a.gamme.libelle.localeCompare(b.gamme.libelle),
      },
      {
        title: 'Demandeur',
        compare: null,
        sortFn: null,
      },
      {
        title: 'Livré',
        compare: null,
        sortFn: null,
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

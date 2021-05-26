import { Component, OnInit } from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../../models/magasin';
import {MarqueService} from '../../../services/dashboard/marque.service';
import {ProduitService} from '../../../services/dashboard/produit.service';
import {Produit} from '../../../models/produit';
import { MagasinService } from 'src/app/services/dashboard/magasin.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Gamme} from '../../../models/gamme';
import {Marque} from '../../../models/marque';
import {Modele} from '../../../models/modele';
import {GammeService} from '../../../services/dashboard/gamme.service';
import {ModeleService} from '../../../services/dashboard/modele.service';
import {MagasinProduit} from '../../../models/magasin-produit';
import {EtatService} from '../../../services/dashboard/etat.service';
import {Etat} from '../../../models/etat';
import {MagasinProduitService} from '../../../services/dashboard/magasin-produit.service';
import {EtatProduitService} from '../../../services/dashboard/etat-produit.service';
import {EtatProduit} from '../../../models/etat-produit';
import { TokenService } from 'src/app/services/token/token.service';
import { Token } from 'src/app/models/token.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {

  validateProduitForm!: FormGroup;

  produitList: Produit[];
  magasinList: Magasin[];
  gammeList: Gamme[];
  marqueList: Marque[];
  modeleList: Modele[];
  produitByMagasinIdList: Produit[] = [];
  etatCourant: Etat = null;
  etatList: Etat[];

  indexOfTab: number;

  listOfColumn: any = [];
  isMagasinSelect: boolean = false;
  magasinChoice: Magasin = null;

  searchValueNumSerie = '';
  visibleNumSerie = false;

  searchValueMarque = '';
  visibleMarque = false;

  listOfDisplayData;

  is_admin: boolean;

  token: Token;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private produitService: ProduitService,
    private magasinService: MagasinService,
    private gammeService: GammeService,
    private marqueService: MarqueService,
    private modeleService: ModeleService,
    private etatService: EtatService,
    private magasinProduitService: MagasinProduitService,
    private etatProduitService: EtatProduitService,
    private tokenService: TokenService
  ) { this.token = this.tokenService.getAccessToken(); }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Matériel', 'Produit']);

    this.makeProduitForm(null, null, null);

    this.listOfColumnHeader();
    this.listMagasin();
    this.listGamme();
    this.listMarque();
    this.listModele();
    this.list();
    this.listEtat();

    this.getEtatByCode("NEW");

    this.is_admin = this.canWrite();

}

canWrite(): boolean {
  return this.token.roles.indexOf(environment.ROLE_ADMIN) > -1;
}

  loadMagasinProduit(){
    console.log('Le magasin');
    console.log(this.magasinChoice);
  }

  makeProduitForm(produit: Produit, magasinProduit: MagasinProduit,  etatProduit: EtatProduit){
    this.validateProduitForm = this.fb.group({
      id: [produit != null ? produit.id : null],
      numSerie: [produit != null ? produit.numSerie : null,
        [Validators.required]],
      modele: [produit != null ? produit.modele : null,
        [Validators.required]],
      marque: [produit != null ? produit.marque : null,
        [Validators.required]],
      gamme: [produit != null ? produit.gamme : null,
        [Validators.required]],
      etat: [etatProduit != null ? etatProduit.etat : null,
        [Validators.required]],
      description: [produit != null ? produit.description : null],
      magazin: [magasinProduit != null ? magasinProduit.magazin : null,
        [Validators.required]],
      idMP: [magasinProduit != null ? magasinProduit.id : null],
    });
  }

  /*makeProduitForm(produit: Produit, magasinProduit: MagasinProduit){
    this.validateProduitForm = this.fb.group({
      id: [produit != null ? produit.id : null],
      numSerie: [produit != null ? produit.numSerie : null],
      modele: [produit != null ? produit.modele : null],
      marque: [produit != null ? produit.marque : null],
      gamme: [produit != null ? produit.gamme : null],
      description: [produit != null ? produit.description : null],
      magazin: [magasinProduit != null ? magasinProduit.magazin : null],
      idMP: [magasinProduit != null ? magasinProduit.id : null],
    });
  }*/

  resetProduitForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateProduitForm.reset();
    for (const key in this.validateProduitForm.controls) {
      this.validateProduitForm.controls[key].markAsPristine();
      this.validateProduitForm.controls[key].updateValueAndValidity();
    }
    this.makeProduitForm(null, null, null);
    this.indexOfTab = 0;
    //this.pageIndex = 1;
  }


  submitProduitForm(): void {
    for (const i in this.validateProduitForm.controls) {
      this.validateProduitForm.controls[i].markAsDirty();
      this.validateProduitForm.controls[i].updateValueAndValidity();
    }

    if (this.validateProduitForm.valid) {

      const formData = this.validateProduitForm.value;
      console.log('FormData -- Formulaire valide');
      console.log(formData);
      if (formData.id == null) {

        console.log(formData.numSerie);

        let newProduit: Produit = new Produit();
        newProduit.numSerie = formData.numSerie;
        newProduit.marque = formData.marque;
        newProduit.modele = formData.modele;
        newProduit.gamme = formData.gamme;
        newProduit.description = formData.description;
        console.log('LE NEW PRODUIT');
        console.log(newProduit);


        this.produitService.createProduit(newProduit).subscribe(
          (data: any) => {
            this.produitList.unshift(data);
            //this.magasinList.push(data)
            this.produitList = [...this.produitList];
            this.listOfDisplayData = [...this.produitList];


            // Enregistrement Magasin Produit

            let newMagasinProduit: MagasinProduit = new MagasinProduit();
            newMagasinProduit.magazin = formData.magazin;
            newMagasinProduit.actuel = true;
            newMagasinProduit.produit = data;
            console.log('LE NEW MAGASIN PRODUIT');
            console.log(newMagasinProduit);

            this.magasinProduitService.createMagasinProduit(newMagasinProduit).subscribe(
              (data: any) => {
                console.log('Enregistrement magasin produit ok');
                console.log(data);
              },
              (error: HttpErrorResponse) => {
              console.log('Enregistrement de magasin produit non ok');

            });

            // Enregistrement Etat Produit

            let newEtatProduit: EtatProduit = new EtatProduit();
            newEtatProduit.actuel = true;
            //newEtatProduit.etat = this.etatCourant;
            newEtatProduit.etat = formData.etat;

            newEtatProduit.produit = data;

            this.etatProduitService.createEtatProduit(newEtatProduit).subscribe(
              (data: any) => {
                console.log('Enregistrement etat produit ok');
                console.log(data);
              },
              (error: HttpErrorResponse) => {
                console.log('Enregistrement de etat produit non ok');

              });

            //Modification de la gamme (equipement) concerné
            //let gm: Gamme[] = this.gammeList.filter(g => g.id == newProduit.gamme.id);
            let gm: Gamme = new Gamme();
            this.gammeService.getGammeById(newProduit.gamme.id).subscribe(
              (data: Gamme) => {

                gm = data;
                gm.nbrStock += 1;

                this.gammeService.updateGamme(gm).subscribe(
                  (data: Gamme) => {
                    console.log('Update ok');
                    console.log(data);
                  },
                  (error: HttpErrorResponse) => {
                    console.log('Update non ok');
                  });

                console.log('Recherche By Id de Gamme ok');


              },
              (error: HttpErrorResponse) => {
                console.log('Recherche By Id de Gamme non ok');
              });


            this.makeProduitForm(null, null, null);
            console.log('Enregistrement produit ok');
            this.indexOfTab = 0;
            //this.pageIndex = 1;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement produit non ok');

          });
      } /*else {
        const i = this.magasinList.findIndex(p => p.id == formData.id);
        this.magasinService.updateMagasin(formData).subscribe(
          (data: Magasin) => {
            console.log(this.magasinList);
            console.log(data);
            this.magasinList[i] = data;
            this.magasinList = [...this.magasinList];
            this.listOfDisplayData = [...this.magasinList];
            console.log(this.magasinList);
            this.makeProduitForm(null, null);

            console.log('Update ok');
            this.indexOfTab = 0;
            //this.pageIndex = 1;

          },
          (error: HttpErrorResponse) => {
            console.log('Update non ok');
          });
      }*/

    }
    else {
      console.log('FormData -- Formulaire non valide');
    }

  }

  /*updateForm(data: Produit){

    this.makeProduitForm(data);

    this.indexOfTab = 1;
  }*/


  list(): void {
    this.produitService.getList().subscribe(
      (data: Produit[]) => {
        this.produitList = [...data];
        console.log('Produit List ==>', this.produitList);

        /*for (let prod of this.produitList){

          for (let etatProd of prod.etatProduits){
            if (etatProd.actuel == true){
              this.etatProduitService.getEtatProduitById(etatProd.id).subscribe(
                (dataEtatProd: EtatProduit) => {
                  prod.etat = dataEtatProd.etat;
                },
                (error: HttpErrorResponse) => {
                  console.log('error get by id etatProduit ==>', error.message, ' ', error.status, ' ', error.statusText);
                });
            }
          }

          for (let magProd of prod.magazinProduits){
            if (magProd.actuel == true){
              this.magasinProduitService.getMagasinProduitById(magProd.id).subscribe(
                (dataMagProd: MagasinProduit) => {
                  prod.magasin = dataMagProd.magazin;
                },
                (error: HttpErrorResponse) => {
                  console.log('error get by id etatProduit ==>', error.message, ' ', error.status, ' ', error.statusText);
                });
            }
          }
        }*/

        this.listOfDisplayData = [...this.produitList];
        //this.pageIndex = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Produit ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listEtat(): void {
    this.etatService.getList().subscribe(
      (data: Etat[]) => {
        this.etatList = [...data];
        console.log('EtatList ==>', this.etatList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList etat ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listMagasin(): void {
    this.magasinService.getList().subscribe(
      (data: Magasin[]) => {
        this.magasinList = data;
        console.log('MagasinList ==>', this.magasinList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Magasin ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listGamme(): void {
    this.gammeService.getList().subscribe(
      (data: Gamme[]) => {
        this.gammeList = data;
        console.log('GammeList ==>', this.gammeList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Gamme ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listMarque(): void {
    this.marqueService.getList().subscribe(
      (data: Marque[]) => {
        this.marqueList = data;
        console.log('MarqueList ==>', this.marqueList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList marque ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listModele(): void {
    this.modeleService.getList().subscribe(
      (data: Modele[]) => {
        this.modeleList = data;
        console.log('ModeleList ==>', this.modeleList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList modele ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  getEtatByCode(code: string): void {
    this.etatService.getEtatByCode(code).subscribe(
      (data: Etat) => {
        this.etatCourant = data;
        console.log('Data etat courant  ==>', this.etatCourant);
      },
      (error: HttpErrorResponse) => {
        console.log('error get data etat courant ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  resetNumSerie(): void {
    this.searchValueNumSerie = '';
    this.searchNumSerie();
  }

  searchNumSerie(): void { //indexOf(this.searchValueNumSerie) !== -1)
    this.visibleNumSerie = false;
    this.listOfDisplayData = this.produitList.filter((item: Produit) => item.numSerie.toString().indexOf(this.searchValueNumSerie) !== -1);
  }

  resetMarque(): void {
    this.searchValueMarque = '';
    this.searchMarque();
  }

  searchMarque(): void {
    this.visibleMarque = false;
    this.listOfDisplayData = this.produitList.filter((item: Produit) => item.marque.libelle.indexOf(this.searchValueMarque) !== -1);
  }

  confirmMsgDelete(data: Produit){
    this.magasinService.deleteMagasin(data.id).subscribe(
      (data01: any) => {
        console.log('data du delete ==>', data01);
        //this.indexOfTab = 0;
        //this.nzMessageService.info('click cancel');
        this.list();
      },
      (error: HttpErrorResponse) => {
        console.log('error deleteMagasin ==>', error.message, ' ', error.status, ' ', error.statusText);
      }
    );
  }

  cancelMsgDelete(): void {
    //this.nzMessageService.info('click confirm');
  }

  listOfColumnHeader(){
    this.listOfColumn = [
      {
        title: 'Numero Série',
        compare: null,
        sortFn: (a: Produit, b: Produit) => a.numSerie.localeCompare(b.numSerie),
        //sortFn: (a: Produit, b: Produit) => a.numSerie - b.numSerie,
      },
      {
        title: 'Gamme',
        compare: null,
        sortFn: (a: Produit, b: Produit) => a.gamme.libelle.localeCompare(b.gamme.libelle),
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
        title: 'Etat',
        compare: null,
        sortFn: null,
      },
      {
        title: 'Magasin',
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

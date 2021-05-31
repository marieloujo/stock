import {Component, OnInit} from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../../models/magasin';
import {MarqueService} from '../../../services/dashboard/marque.service';
import {ProduitService} from '../../../services/dashboard/produit.service';
import {Produit} from '../../../models/produit';
import {MagasinService} from 'src/app/services/dashboard/magasin.service';
import {HttpErrorResponse} from '@angular/common/http';
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
import {TokenService} from 'src/app/services/token/token.service';
import {Token} from 'src/app/models/token.model';
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
  pageIndex;

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
  ) {
    this.token = this.tokenService.getAccessToken();
  }

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.id === o2.id : o1 === o2);

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Matériel', 'Produit']);

    this.makeProduitForm(null);

    this.listOfColumnHeader();
    this.listMagasin();
    this.listGamme();
    this.listMarque();
    this.listModele();
    this.list();
    this.listEtat();

    this.getEtatByCode('NEW');

    this.is_admin = this.canWrite();

  }

  canWrite(): boolean {
    return this.token.roles.indexOf(environment.ROLE_ADMIN) > -1;
  }

  loadMagasinProduit() {
    console.log('Le magasin');
    console.log(this.magasinChoice);
  }

  /*makeProduitForm(produit: Produit, magasinProduit: MagasinProduit, etatProduit: EtatProduit) {*/
  makeProduitForm(produit: Produit) {
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
      etat: [produit != null ? produit.etat : null,
        [Validators.required]],
      description: [produit != null ? produit.description : null],
      magazin: [produit != null ? produit.magasin : null,
        [Validators.required]],
      /*idMP: [magasinProduit != null ? magasinProduit.id : null],*/
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
    this.makeProduitForm(null);
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

                //chargement liste Produit pour affichage
                this.list();

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
            newEtatProduit.dateHeure = new Date();

            this.etatProduitService.createEtatProduit(newEtatProduit).subscribe(
              (data: any) => {
                console.log('Enregistrement etat produit ok');
                console.log(data);

                //chargement liste Produit pour affichage
                this.list();

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

            this.makeProduitForm(null);
            console.log('Enregistrement produit ok');
            //chargement liste Produit pour affichage
            this.list();
            this.indexOfTab = 0;
            //this.pageIndex = 1;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement produit non ok');

          });
      } else {

        const i = this.magasinList.findIndex(p => p.id == formData.id);
        console.log(i);

        let newUpdateProduit: Produit = new Produit();
        newUpdateProduit.id = formData.id;
        newUpdateProduit.numSerie = formData.numSerie;
        newUpdateProduit.marque = formData.marque;
        newUpdateProduit.modele = formData.modele;
        newUpdateProduit.gamme = formData.gamme;
        newUpdateProduit.description = formData.description;
        console.log('LE NEW UPDATE PRODUIT');
        console.log(newUpdateProduit);

        this.produitService.updateProduit(newUpdateProduit).subscribe(
          (data: Produit) => {
            console.log('The data produit update okok');
            console.log(data);
            this.produitList[i] = data;
            this.produitList = [...this.produitList];
            this.listOfDisplayData = [...this.produitList];
            console.log(this.produitList);

            let newUpdateEtatProduit: EtatProduit = new EtatProduit();
            let newUpdateEtatProd = data.etatProduits.find(ep => ep.actuel == true);
            newUpdateEtatProduit.etat = formData.etat;
            newUpdateEtatProduit.produit = data;
            newUpdateEtatProduit.dateHeure = new Date();
            newUpdateEtatProduit.actuel = true;
            newUpdateEtatProduit.id = newUpdateEtatProd.id;

            console.log('le new Update de EtatProduit');
            console.log(newUpdateEtatProduit);
            console.log(newUpdateEtatProd);
            this.etatProduitService.updateEtatProduit(newUpdateEtatProduit).subscribe(
              (dataEP: EtatProduit) => {
                console.log('Update ok pour etatProduit ');
                console.log(dataEP);

                //chargement liste Produit pour affichage
                this.list();

              }, (error: HttpErrorResponse) => {
                console.log('Update etatProduit non ok ' + error.status + '  ' + error.statusText + '  ' + error.message);
              }
            );

            let newUpdateMagasinProduit: MagasinProduit = new MagasinProduit();
            let newUpdateMagProd = data.magazinProduits.find(mp => mp.actuel == true);
            newUpdateMagasinProduit.magazin = formData.magazin;
            newUpdateMagasinProduit.produit = data;
            newUpdateMagasinProduit.dateHeure = new Date();
            newUpdateMagasinProduit.actuel = true;
            newUpdateMagasinProduit.id = newUpdateMagProd.id;

            console.log('le new Update de MagasinPoduit');
            console.log(newUpdateMagasinProduit);
            console.log(newUpdateMagProd);
            this.magasinProduitService.updateMagasinProduit(newUpdateMagasinProduit).subscribe(
              (dataMP: MagasinProduit) => {
                console.log('Update ok pour MagasinProduit ');
                console.log(dataMP);

                //chargement liste Produit pour affichage
                this.list();

              }, (error: HttpErrorResponse) => {
                console.log('Update MagasinProduit non ok ' + error.status + '  ' + error.statusText + '  ' + error.message);
              }
            );

            this.makeProduitForm(null);
            //chargement liste Produit pour affichage
            this.list();
            this.indexOfTab = 0;

            console.log('Update Produit ok');

          },
          (error: HttpErrorResponse) => {
            console.log('Update Produit non ok ' + error.status + '  ' + error.statusText + '  ' + error.message);
          });
      }
    } else {
      console.log('FormData -- Formulaire non valide');
    }

  }

  updateForm(data: Produit) {
    console.log('la data de update');
    console.log(data);

    this.makeProduitForm(data);

    this.indexOfTab = 1;
  }


  list(): void {
    this.produitService.getList().subscribe(
      (data: Produit[]) => {
        this.produitList = [...data];
        console.log('Produit List ==>', this.produitList);

        for (let prod of this.produitList) {
          console.log('le produit ==> ');
          console.log(prod);
          let etatProd: EtatProduit = prod.etatProduits.find(p => p.actuel == true);
          console.log(etatProd);

          this.etatProduitService.getEtatProduitById(etatProd?.id).subscribe(
            (dataEtatProd: EtatProduit) => {
              console.log('DataEtatProd');
              console.log(dataEtatProd.etat.libelle);
              prod.etat = dataEtatProd.etat;
            },
            (error: HttpErrorResponse) => {
              console.log('error get by id etatProduit ==>', error.message, ' ', error.status, ' ', error.statusText);
            });

          let magProd: MagasinProduit = prod.magazinProduits.find(m => m.actuel == true);
          this.magasinProduitService.getMagasinProduitById(magProd?.id).subscribe(
            (dataMagProd: MagasinProduit) => {
              console.log('DataMagProd');
              console.log(dataMagProd.magazin.libelle);
              prod.magasin = dataMagProd.magazin;
            },
            (error: HttpErrorResponse) => {
              console.log('error get by id magasinProduit ==>', error.message, ' ', error.status, ' ', error.statusText);
            });
        }

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

  confirmMsgDelete(data: Produit) {
    this.produitService.deleteProduit(data.id).subscribe(
      (data01: any) => {
        console.log('data du delete Produit==>', data01);
        //this.indexOfTab = 0;
        //this.nzMessageService.info('click cancel');
        this.list();
      },
      (error: HttpErrorResponse) => {
        console.log('error delete Produit  ==>', error.message, ' ', error.status, ' ', error.statusText);
      }
    );
  }

  cancelMsgDelete(): void {
    //this.nzMessageService.info('click confirm');
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

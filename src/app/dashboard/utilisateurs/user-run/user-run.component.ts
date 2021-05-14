import { Component, OnInit } from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../../models/magasin';
import {MagasinService} from '../../../services/dashboard/magasin.service';
import {Personne} from '../../../models/personne';
import {PersonneService} from '../../../services/dashboard/personne.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ProfilService} from '../../../services/dashboard/profil.service';
import {ServiceBService} from '../../../services/dashboard/service-b.service';
import {Produit} from '../../../models/produit';
import {Profil} from '../../../models/profil';
import {ServiceB} from '../../../models/service-b';

@Component({
  selector: 'app-user-run',
  templateUrl: './user-run.component.html',
  styleUrls: ['./user-run.component.css']
})
export class UserRunComponent implements OnInit {

  validatePersonneForm!: FormGroup;

  personneList: Personne[];
  profilList: Profil[];
  serviceBList: ServiceB[];

  indexOfTab: number;

  listOfColumn: any = [];

  searchValue = '';
  visible = false;
  listOfDisplayData;
  pageIndex;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private personneService: PersonneService,
    private profilService: ProfilService,
    private serviceBService: ServiceBService,
    //private nzMessageService: NzMessageService
  ) { }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Gestion Utilisateur', 'User']);

    this.makePersonneForm(null);

    this.list();

    this.listOfColumnHeadeer();

    this.listProfil();
    this.listService();

  }

  listProfil(): void {
    this.profilService.getList().subscribe(
      (data: Profil[]) => {
        this.profilList = data;
        console.log('Profil List ==>', this.profilList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Profil ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listService(): void {
    this.serviceBService.getList().subscribe(
      (data: ServiceB[]) => {
        this.serviceBList = data;
        console.log('Service List ==>', this.serviceBList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Service ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  makePersonneForm(personne: Personne){
    this.validatePersonneForm = this.fb.group({
      id: [personne != null ? personne.id : null],
      nom: [personne != null ? personne.nom : null,
        [Validators.required]],
      prenom: [personne != null ? personne.prenom : null,
        [Validators.required]],
      sexe: [personne != null ? personne.sexe : null,
        [Validators.required]],
      email: [personne != null ? personne.email : null,
        [Validators.required]],
      profil: [personne != null ? personne.profil : null,
        [Validators.required]],
      serviceB: [personne != null ? personne.serviceB : null,
        [Validators.required]],
    });
  }

  resetPersonneForm(e: MouseEvent): void {
    e.preventDefault();
    this.validatePersonneForm.reset();
    for (const key in this.validatePersonneForm.controls) {
      this.validatePersonneForm.controls[key].markAsPristine();
      this.validatePersonneForm.controls[key].updateValueAndValidity();
    }
    this.makePersonneForm(null);
    this.indexOfTab = 0;
    this.pageIndex = 1;
  }

  submitPersonneForm(): void {
    for (const i in this.validatePersonneForm.controls) {
      this.validatePersonneForm.controls[i].markAsDirty();
      this.validatePersonneForm.controls[i].updateValueAndValidity();
    }

    if (this.validatePersonneForm.valid) {

      const formData = this.validatePersonneForm.value;
      if (formData.id == null) {
        this.personneService.createPersonne(formData).subscribe(
          (data: any) => {
            this.personneList.unshift(data);
            //this.personneList.push(data)
            this.personneList = [...this.personneList];
            this.listOfDisplayData = [...this.personneList];
            this.makePersonneForm(null);

            console.log('Enregistrement ok');
            this.indexOfTab = 0;
            this.pageIndex = 1;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement non ok');

          });
      } else {
        const i = this.personneList.findIndex(p => p.id == formData.id);
        this.personneService.updatePersonne(formData).subscribe(
          (data: Personne) => {
            console.log(this.personneList);
            console.log(data);
            this.personneList[i] = data;
            this.personneList = [...this.personneList];
            this.listOfDisplayData = [...this.personneList];
            console.log(this.personneList);
            this.makePersonneForm(null);

            console.log('Update ok');
            this.indexOfTab = 0;
            this.pageIndex = 1;

          },
          (error: HttpErrorResponse) => {
            console.log('Update non ok');
          });
      }

    }
    else {

    }
  }

  list(): void {
    this.personneService.getList().subscribe(
      (data: Personne[]) => {
        this.personneList = data;
        console.log('Personne List ==>', this.personneList);
        this.listOfDisplayData = [...this.personneList];
        this.pageIndex = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('error getList personne ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.personneList.filter((item: Personne) => item.nom.indexOf(this.searchValue) !== -1);
  }

  updateForm(data: Personne){
    this.makePersonneForm(data);
    this.indexOfTab = 1;
  }

  confirmMsgDelete(data: Magasin){
    this.personneService.deletePersonne(data.id).subscribe(
      (data01: any) => {
        console.log('data du delete ==>', data01);
        //this.indexOfTab = 0;
        //this.nzMessageService.info('click cancel');
        this.list();
      },
      (error: HttpErrorResponse) => {
        console.log('error delete Personne ==>', error.message, ' ', error.status, ' ', error.statusText);
      }
    );
  }

  cancelMsgDelete(): void {
    //this.nzMessageService.info('click confirm');
  }

  listOfColumnHeadeer(){
    this.listOfColumn = [
      {
        title: 'Nom',
        compare: null,
        sortFn: (a: Personne, b: Personne) => a.nom.localeCompare(b.nom),
      },
      {
        title: 'Prénom',
        compare: null,
        sortFn: (a: Personne, b: Personne) => a.prenom.localeCompare(b.prenom),
      },
      {
        title: 'Email',
        compare: null,
        sortFn: (a: Personne, b: Personne) => a.email.localeCompare(b.email),
      },
      {
        title: 'Sexe',
        compare: null,
        sortFn: (a: Personne, b: Personne) => a.sexe.localeCompare(b.sexe),
      },
      {
        title: 'Profil',
        compare: null,
        sortFn: (a: Personne, b: Personne) => a.profil.libelle.localeCompare(b.profil.libelle),
      },
      {
        title: 'Service',
        compare: null,
        sortFn: (a: Personne, b: Personne) => a.serviceB.libelle.localeCompare(b.serviceB.libelle),
      },
    ];
  }

}

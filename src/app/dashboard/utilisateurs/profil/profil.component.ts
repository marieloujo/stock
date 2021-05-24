import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profil } from 'src/app/models/profil';
import { ServiceB } from 'src/app/models/service-b';
import { ProfilService } from 'src/app/services/dashboard/profil.service';
import {BehaviorService} from '../../../services/common/behavior.service';
import {Magasin} from '../../../models/magasin';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  profilList: Profil[];

  listOfColumn: any = [];

  validateProfilForm!: FormGroup;

  indexOfTab: number;

  searchValue = '';
  visible = false;
  listOfDisplayData;
  pageIndex;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private profilService: ProfilService,
  ) { }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Gestion Utilisateur', 'Profil']);

    this.listOfColumnHeadeer();

    this.makeProfilForm(null);

    this.list();

  }

  listOfColumnHeadeer(){
    this.listOfColumn = [
      {
        title: 'Libellé',
        compare: null,
        sortFn: (a: Magasin, b: Magasin) => a.libelle.localeCompare(b.libelle),
      },
    ];
  }

  makeProfilForm(profil: Profil){
    this.validateProfilForm = this.fb.group({
      id: [profil != null ? profil.id : null],
      libelle: [profil != null ? profil.libelle : null,
        [Validators.required]],
    });
  }

  resetProfilForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateProfilForm.reset();
    for (const key in this.validateProfilForm.controls) {
      this.validateProfilForm.controls[key].markAsPristine();
      this.validateProfilForm.controls[key].updateValueAndValidity();
    }
    this.makeProfilForm(null);
    console.log('Tab en cours ==> ', this.indexOfTab);
  }

  updateForm(data: Profil){
    this.makeProfilForm(data);
    this.indexOfTab = 1;
  }

  confirmMsgDelete(data: Profil){

    this.profilService.deleteProfil(data.id).subscribe(
      (data01: any) => {
        console.log('data du delete ==>', data01);
        //this.indexOfTab = 0;
        //this.nzMessageService.info('click cancel');
        this.list();
      },
      (error: HttpErrorResponse) => {
        console.log('error deleteEtat ==>', error.message, ' ', error.status, ' ', error.statusText);
      }
    );
  }


  cancelMsgDelete(): void {
    //this.nzMessageService.info('click confirm');
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.profilList.filter((item: Profil) => item.libelle.indexOf(this.searchValue) !== -1);
  }


  submitProfilForm(): void {
    for (const i in this.validateProfilForm.controls) {
      this.validateProfilForm.controls[i].markAsDirty();
      this.validateProfilForm.controls[i].updateValueAndValidity();
    }

    if (this.validateProfilForm.valid) {

      const formData = this.validateProfilForm.value;
      if (formData.id == null) {
        this.profilService.createProfil(formData).subscribe(
          (data: any) => {
            this.profilList.unshift(data);
            this.profilList = [...this.profilList];
            this.listOfDisplayData = [...this.profilList];
            this.makeProfilForm(null);

            console.log('Enregistrement ok');
            this.indexOfTab = 0;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement non ok');

          });
      } else {
        const i = this.profilList.findIndex(p => p.id == formData.id);
        this.profilService.updateProfil(formData).subscribe(
          (data: any) => {
            this.profilList[i] = data;
            this.profilList = [...this.profilList];
            this.listOfDisplayData = [...this.profilList];
            this.makeProfilForm(null);

            console.log('Update ok');
            this.indexOfTab = 0;

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
    this.profilService.getList().subscribe(
      (data: any) => {
        this.profilList = data;
        console.log('Profil List ==>', this.profilList);
        this.listOfDisplayData = [...this.profilList];
        this.pageIndex = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('error getList profil ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

}

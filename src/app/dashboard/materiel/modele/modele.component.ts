import { Component, OnInit } from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../../models/magasin';
import {MagasinService} from '../../../services/dashboard/magasin.service';
import {ModeleService} from '../../../services/dashboard/modele.service';
import {Modele} from '../../../models/modele';
import {HttpErrorResponse} from '@angular/common/http';
import { TokenService } from 'src/app/services/token/token.service';
import { Token } from 'src/app/models/token.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-modele',
  templateUrl: './modele.component.html',
  styleUrls: ['./modele.component.css']
})
export class ModeleComponent implements OnInit {

  validateMagasinForm!: FormGroup;

  modeleList: Modele[];

  searchValue = '';
  visible = false;
  listOfDisplayData;
  pageIndex;

  indexOfTab: number;

  listOfColumn: any = [];

  is_admin: boolean;

  token: Token;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private modeleService: ModeleService,
    private tokenService: TokenService
  ) { this.token = this.tokenService.getAccessToken(); }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Matériel', 'Modèle']);

    this.makeModeleForm(null);

    this.list();

    this.listOfColumnHeadeer();

    this.is_admin = this.canWrite();

}

canWrite(): boolean {
  return this.token.roles.indexOf(environment.ROLE_ADMIN) > -1;
}

  makeModeleForm(modele: Modele){
    this.validateMagasinForm = this.fb.group({
      id: [modele != null ? modele.id : null],
      libelle: [modele != null ? modele.libelle : null,
        [Validators.required]],
    });
  }

  resetModelForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateMagasinForm.reset();
    for (const key in this.validateMagasinForm.controls) {
      this.validateMagasinForm.controls[key].markAsPristine();
      this.validateMagasinForm.controls[key].updateValueAndValidity();
    }
    this.makeModeleForm(null);
    console.log('Tab en cours ==> ', this.indexOfTab);
    this.indexOfTab = 0;
  }

  updateForm(data: Modele){

    this.makeModeleForm(data);

    this.indexOfTab = 1;
  }

  list(): void {
    this.modeleService.getList().subscribe(
      (data: any) => {
        this.modeleList = [...data];
        console.log('MagasinList ==>', this.modeleList);
        this.listOfDisplayData = [...this.modeleList];
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Magasin ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.modeleList.filter((item: Modele) => item.libelle.indexOf(this.searchValue) !== -1);
  }

  confirmMsgDelete(data: Modele){

    this.modeleService.deleteModele(data.id).subscribe(
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


  listOfColumnHeadeer(){
    this.listOfColumn = [
      /*{
        title: 'Name',
        compare: null,
        priority: false
      },*/
      {
        title: 'Libellé',
        compare: null,
        sortFn: (a: Modele, b: Modele) => a.libelle.localeCompare(b.libelle),
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

  submitModeleForm(): void {
    for (const i in this.validateMagasinForm.controls) {
      this.validateMagasinForm.controls[i].markAsDirty();
      this.validateMagasinForm.controls[i].updateValueAndValidity();
    }

    if (this.validateMagasinForm.valid) {

      const formData = this.validateMagasinForm.value;
      if (formData.id == null) {
        this.modeleService.createModele(formData).subscribe(
          (data: any) => {
            this.modeleList.unshift(data);
            this.modeleList = [...this.modeleList];
            this.listOfDisplayData = [...this.modeleList];
            this.makeModeleForm(null);

            console.log('Enregistrement ok');
            this.indexOfTab = 0;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement non ok');

          });
      } else {
        const i = this.modeleList.findIndex(p => p.id == formData.id);
        this.modeleService.updateModele(formData).subscribe(
          (data: Modele) => {
            this.modeleList[i] = data;
            this.modeleList = [...this.modeleList];
            this.listOfDisplayData = [...this.modeleList];
            this.makeModeleForm(null);

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

}

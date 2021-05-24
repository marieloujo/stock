import {Component, OnInit} from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Etat} from '../../../models/etat';
import {EtatService} from '../../../services/dashboard/etat.service';
import {HttpErrorResponse} from '@angular/common/http';
import { TokenService } from 'src/app/services/token/token.service';
import { Token } from 'src/app/models/token.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-etat',
  templateUrl: './etat.component.html',
  styleUrls: ['./etat.component.css']
})
export class EtatComponent implements OnInit {

  validateEtatForm!: FormGroup;

  etatList: Etat[];

  indexOfTab: number;

  listOfColumn: any = [];

  etatExist = false;

  is_admin: boolean;

  token: Token;

  constructor(
    private fb: FormBuilder,
    private etatService: EtatService,
    private behaviorService: BehaviorService,
    private tokenService: TokenService
  ) {
      this.token = this.tokenService.getAccessToken();
  }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Matériel', 'Etat']);

    this.makeEtatForm(null);

    this.list();

    this.listOfColumnHeadeer();

    this.is_admin = this.canWrite();  

  }

  canWrite(): boolean {
    return this.token.roles.indexOf(environment.ROLE_ADMIN) > -1;
  }

  makeEtatForm(etat: Etat) {
    this.validateEtatForm = this.fb.group({
      id: [etat != null ? etat.id : null],
      code: [etat != null ? etat.code : null,
        [Validators.required]],
      libelle: [etat != null ? etat.libelle : null,
        [Validators.required]],
    });
  }

  resetEtatForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateEtatForm.reset();
    for (const key in this.validateEtatForm.controls) {
      this.validateEtatForm.controls[key].markAsPristine();
      this.validateEtatForm.controls[key].updateValueAndValidity();
    }
    this.makeEtatForm(null);
    console.log('Tab en cours ==> ', this.indexOfTab);
  }

  updateForm(data: Etat) {

    this.makeEtatForm(data);

    this.indexOfTab = 1;
  }


  list(): void {
    this.etatService.getList().subscribe(
      (data: any) => {
        this.etatList = data;
        console.log('EtatList ==>', this.etatList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Etat ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  confirmMsgDelete(data: Etat) {

    this.etatService.deleteEtat(data.id).subscribe(
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

  submitEtatForm(): void {
    for (const i in this.validateEtatForm.controls) {
      this.validateEtatForm.controls[i].markAsDirty();
      this.validateEtatForm.controls[i].updateValueAndValidity();
    }

    if (this.validateEtatForm.valid) {

      this.etatExist = false;

      const formData = this.validateEtatForm.value;

      for (let etat of this.etatList) {
        if (formData.code.toUpperCase() == etat.code.toUpperCase() || formData.libelle.toUpperCase() == etat.libelle.toUpperCase()) {
          this.etatExist = true;
        }
      }

      if (formData.id == null && this.etatExist == false) {
        this.etatService.createEtat(formData).subscribe(
          (data: any) => {
            this.etatList.unshift(data);
            this.etatList = [...this.etatList];
            this.makeEtatForm(null);

            console.log('Enregistrement ok');
            this.indexOfTab = 0;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement non ok');

          });
      }
      if (formData.id != null && this.etatExist == false) {

        const i = this.etatList.findIndex(p => p.id == formData.id);
        this.etatService.updateEtat(formData).subscribe(
          (data: Etat) => {
            this.etatList[i] = data;
            this.etatList = [...this.etatList];
            this.makeEtatForm(null);

            console.log('Update ok');
            this.indexOfTab = 0;

          },
          (error: HttpErrorResponse) => {
            console.log('Update non ok');
          });
      }

    } else {

    }

  }

  listOfColumnHeadeer() {
    this.listOfColumn = [

      {
        title: 'Code',
        compare: null,
        sortFn: (a: Etat, b: Etat) => a.code.localeCompare(b.code),
      },
      {
        title: 'Libellé',
        compare: null,
        sortFn: (a: Etat, b: Etat) => a.libelle.localeCompare(b.libelle),
      },

    ];
  }

}




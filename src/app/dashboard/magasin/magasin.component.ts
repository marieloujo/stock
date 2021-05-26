import { Component, OnInit } from '@angular/core';
import {BehaviorService} from '../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../models/magasin';
import {HttpErrorResponse} from '@angular/common/http';
import {MagasinService} from '../../services/dashboard/magasin.service';
import {Produit} from '../../models/produit';
import { TokenService } from 'src/app/services/token/token.service';
import { Token } from 'src/app/models/token.model';
import {environment} from '../../../environments/environment';
//import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-magasin',
  templateUrl: './magasin.component.html',
  styleUrls: ['./magasin.component.css']
})
export class MagasinComponent implements OnInit {


  validateMagasinForm!: FormGroup;
  magasinList: Magasin[];
  indexOfTab: number;
  listOfColumn: any = [];

  searchValue = '';
  visible = false;
  listOfDisplayData;
  pageIndex;

  is_admin: boolean;

  token: Token;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private magasinService: MagasinService,
    private tokenService: TokenService
    //private nzMessageService: NzMessageService
  ) {
      this.token = tokenService.getAccessToken();
  }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Magasins']);

    this.makeMagasinForm(null);

    this.list();

    this.listOfColumnHeadeer();

    this.is_admin = this.canWrite();

  }


  canWrite(): boolean {
    return this.token.roles.indexOf(environment.ROLE_ADMIN) > -1;
  }


  makeMagasinForm(magasin: Magasin){
    this.validateMagasinForm = this.fb.group({
      id: [magasin != null ? magasin.id : null],
      libelle: [magasin != null ? magasin.libelle : null,
        [Validators.required]],
    });
  }

  resetMagasinForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateMagasinForm.reset();
    for (const key in this.validateMagasinForm.controls) {
      this.validateMagasinForm.controls[key].markAsPristine();
      this.validateMagasinForm.controls[key].updateValueAndValidity();
    }
    this.makeMagasinForm(null);
    this.indexOfTab = 0;
    this.pageIndex = 1;
  }

  submitMagasinForm(): void {
    for (const i in this.validateMagasinForm.controls) {
      this.validateMagasinForm.controls[i].markAsDirty();
      this.validateMagasinForm.controls[i].updateValueAndValidity();
    }

    if (this.validateMagasinForm.valid) {

      const formData = this.validateMagasinForm.value;
      //formData.libelle.trim();
      if (formData.id == null) {
        this.magasinService.createMagasin(formData).subscribe(
          (data: any) => {
            this.magasinList.unshift(data);
            //this.magasinList.push(data)
            this.magasinList = [...this.magasinList];
            this.listOfDisplayData = [...this.magasinList];
            this.makeMagasinForm(null);

            console.log('Enregistrement ok');
            this.indexOfTab = 0;
            this.pageIndex = 1;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement non ok');

          });
      } else {
        const i = this.magasinList.findIndex(p => p.id == formData.id);
        this.magasinService.updateMagasin(formData).subscribe(
          (data: Magasin) => {
            console.log(this.magasinList);
            console.log(data);
            this.magasinList[i] = data;
            this.magasinList = [...this.magasinList];
            this.listOfDisplayData = [...this.magasinList];
            console.log(this.magasinList);
            this.makeMagasinForm(null);

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
    this.magasinService.getList().subscribe(
      (data: Magasin[]) => {
        this.magasinList = data;
        console.log('MagasinList ==>', this.magasinList);
        this.listOfDisplayData = [...this.magasinList];
        this.pageIndex = 1;
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
    this.listOfDisplayData = this.magasinList.filter((item: Magasin) => item.libelle.indexOf(this.searchValue) !== -1);
  }

  updateForm(data: Magasin){
    this.makeMagasinForm(data);
    this.indexOfTab = 1;
  }

  confirmMsgDelete(data: Magasin){
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

  /*cancelMsgDelete(): void {
    this.nzMessageService.info('click cancel');
  }*/

  cancelMsgDelete(): void {
    //this.nzMessageService.info('click confirm');
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

}

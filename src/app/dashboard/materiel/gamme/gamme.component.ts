import {Component, OnInit} from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GammeService} from '../../../services/dashboard/gamme.service';
import {Gamme} from '../../../models/gamme';
import {HttpErrorResponse} from '@angular/common/http';
import {TokenService} from 'src/app/services/token/token.service';
import {Token} from 'src/app/models/token.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-gamme',
  templateUrl: './gamme.component.html',
  styleUrls: ['./gamme.component.css']
})
export class GammeComponent implements OnInit {

  validateMagasinForm!: FormGroup;

  gammeList: Gamme[];

  searchValue = '';
  visible = false;
  searchValueSM = '';
  visibleSM = false;
  listOfDisplayData;
  pageIndex;

  indexOfTab: number;

  listOfColumn: any = [];

  textValue: string | null = null;

  is_admin: boolean;
  token: Token;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private gammeService: GammeService,
    private tokenService: TokenService
  ) {
    this.token = this.tokenService.getAccessToken();
  }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Matériel', 'Equipement']);

    this.makeGammeForm(null);

    this.list();

    this.listOfColumnHeadeer();

    this.is_admin = this.canWrite();
    console.log(this.is_admin);

  }

  canWrite(): boolean {
    return this.token.roles.indexOf(environment.ROLE_ADMIN) > -1;
  }

  makeGammeForm(gamme: Gamme) {
    this.validateMagasinForm = this.fb.group({
      id: [gamme != null ? gamme.id : null],
      libelle: [gamme != null ? gamme.libelle : null,
        [Validators.required]],
      stockMin: [gamme != null ? gamme.stockMin : null,
        [Validators.required]],
      description: [gamme != null ? gamme.description : null,],
    });
  }

  resetGammeForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateMagasinForm.reset();
    for (const key in this.validateMagasinForm.controls) {
      this.validateMagasinForm.controls[key].markAsPristine();
      this.validateMagasinForm.controls[key].updateValueAndValidity();
    }
    this.makeGammeForm(null);
    console.log('Tab en cours ==> ', this.indexOfTab);
    this.indexOfTab = 0;
  }

  updateForm(data: Gamme) {

    this.makeGammeForm(data);

    this.indexOfTab = 1;
  }


  list(): void {
    this.gammeService.getList().subscribe(
      (data: any) => {
        this.gammeList = [...data];
        console.log('Gamme List ==>', this.gammeList);
        this.listOfDisplayData = [...this.gammeList];
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Gamme ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  listOfColumnHeadeer() {
    this.listOfColumn = [
      {
        title: 'Libellé',
        compare: null,
        sortFn: (a: Gamme, b: Gamme) => a.libelle.localeCompare(b.libelle),
      },
      {
        title: 'Description',
        compare: null,
        sortFn: null,
      },
      {
        title: 'Stock minimal',
        compare: null,
        sortFn: (a: Gamme, b: Gamme) => a.stockMin - b.stockMin,

      },
    ];
  }

  confirmMsgDelete(data: Gamme) {
    this.gammeService.deleteGamme(data.id).subscribe(
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
    this.listOfDisplayData = this.gammeList.filter((item: Gamme) => item.libelle.indexOf(this.searchValue) !== -1);
  }

  resetSM(): void {
    this.searchValueSM = '';
    this.searchSM();
  }

  searchSM(): void {
    this.visibleSM = false;
    this.listOfDisplayData = this.gammeList.filter((item: Gamme) => item.stockMin.toString().indexOf(this.searchValueSM) !== -1);
  }

  submitGameForm(): void {
    for (const i in this.validateMagasinForm.controls) {
      this.validateMagasinForm.controls[i].markAsDirty();
      this.validateMagasinForm.controls[i].updateValueAndValidity();
    }

    if (this.validateMagasinForm.valid) {

      const formData = this.validateMagasinForm.value;
      if (formData.id == null) {
        this.gammeService.createGamme(formData).subscribe(
          (data: any) => {
            this.gammeList.unshift(data);
            this.gammeList = [...this.gammeList];
            this.listOfDisplayData = [...this.gammeList];
            this.makeGammeForm(null);

            console.log('Enregistrement ok');
            this.indexOfTab = 0;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement non ok');

          });
      } else {
        const i = this.gammeList.findIndex(p => p.id == formData.id);
        this.gammeService.updateGamme(formData).subscribe(
          (data: Gamme) => {
            this.gammeList[i] = data;
            this.gammeList = [...this.gammeList];
            this.listOfDisplayData = [...this.gammeList];
            this.makeGammeForm(null);

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

}

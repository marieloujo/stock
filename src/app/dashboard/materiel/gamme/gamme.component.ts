import { Component, OnInit } from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../../models/magasin';
import {MagasinService} from '../../../services/dashboard/magasin.service';
import {GammeService} from '../../../services/dashboard/gamme.service';
import {Gamme} from '../../../models/gamme';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-gamme',
  templateUrl: './gamme.component.html',
  styleUrls: ['./gamme.component.css']
})
export class GammeComponent implements OnInit {

  validateMagasinForm!: FormGroup;

  gammeList: Gamme[];

  indexOfTab: number;

  listOfColumn: any = [];

  textValue: string | null = null;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private gammeService: GammeService
  ) { }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Matériel', 'Equipement']);

    this.makeGammeForm(null);

    this.list();

    this.listOfColumnHeadeer();

  }

  makeGammeForm(gamme: Gamme){
    this.validateMagasinForm = this.fb.group({
      id: [gamme != null ? gamme.id : null],
      libelle: [gamme != null ? gamme.libelle : null,
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

  updateForm(data: Gamme){

    this.makeGammeForm(data);

    this.indexOfTab = 1;
  }


  list(): void {
    this.gammeService.getList().subscribe(
      (data: any) => {
        this.gammeList = data;
        console.log('MagasinList ==>', this.gammeList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Magasin ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
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
        priority: false
      },
      {
        title: 'Description',
        compare: null,
        priority: false
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


  confirmMsgDelete(data: Gamme){

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
            this.makeGammeForm(null);

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

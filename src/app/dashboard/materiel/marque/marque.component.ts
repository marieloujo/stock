import { Component, OnInit } from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../../models/magasin';
import {MagasinService} from '../../../services/dashboard/magasin.service';
import {MarqueService} from '../../../services/dashboard/marque.service';
import {Marque} from '../../../models/marque';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-marque',
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.css']
})
export class MarqueComponent implements OnInit {

  validateMagasinForm!: FormGroup;

  marqueList: Marque[];

  indexOfTab: number;

  listOfColumn: any = [];

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private marqueService: MarqueService
  ) { }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Matériel', 'Marque']);


    this.makeMarqueForm(null);

    this.list();

    this.listOfColumnHeadeer();
  }

  makeMarqueForm(magasin: Magasin){
    this.validateMagasinForm = this.fb.group({
      id: [magasin != null ? magasin.id : null],
      libelle: [magasin != null ? magasin.libelle : null,
        [Validators.required]],
    });
  }

  resetMarqueForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateMagasinForm.reset();
    for (const key in this.validateMagasinForm.controls) {
      this.validateMagasinForm.controls[key].markAsPristine();
      this.validateMagasinForm.controls[key].updateValueAndValidity();
    }
    this.makeMarqueForm(null);
    console.log('Tab en cours ==> ', this.indexOfTab);
    this.indexOfTab = 0;
  }


  updateForm(data: Marque){

    this.makeMarqueForm(data);

    this.indexOfTab = 1;
  }


  list(): void {
    this.marqueService.getList().subscribe(
      (data: any) => {
        this.marqueList = data;
        console.log('MagasinList ==>', this.marqueList);
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Magasin ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  confirmMsgDelete(data: Marque){

    this.marqueService.deleteMarque(data.id).subscribe(
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

      {
        title: 'Libellé',
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

  submitMarqueForm(): void {
    for (const i in this.validateMagasinForm.controls) {
      this.validateMagasinForm.controls[i].markAsDirty();
      this.validateMagasinForm.controls[i].updateValueAndValidity();
    }

    if (this.validateMagasinForm.valid) {

      const formData = this.validateMagasinForm.value;
      if (formData.id == null) {
        this.marqueService.createMarque(formData).subscribe(
          (data: any) => {
            this.marqueList.unshift(data);
            this.marqueList = [...this.marqueList];
            this.makeMarqueForm(null);

            console.log('Enregistrement ok');
            this.indexOfTab = 0;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement non ok');

          });
      } else {
        const i = this.marqueList.findIndex(p => p.id == formData.id);
        this.marqueService.updateMarque(formData).subscribe(
          (data: Marque) => {
            this.marqueList[i] = data;
            this.marqueList = [...this.marqueList];
            this.makeMarqueForm(null);

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

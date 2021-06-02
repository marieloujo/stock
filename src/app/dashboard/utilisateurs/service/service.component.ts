import { Component, OnInit } from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../../models/magasin';
import {MagasinService} from '../../../services/dashboard/magasin.service';
import {ServiceBService} from '../../../services/dashboard/service-b.service';
import {ServiceB} from '../../../models/service-b';
import {HttpErrorResponse} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  validateServiceForm!: FormGroup;

  serviceList: Magasin[];

  indexOfTab: number;

  listOfColumn: any = [];

  searchValue = '';
  visible = false;
  listOfDisplayData;
  pageIndex;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private serviceBService: ServiceBService,
  ) { }

  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Gestion Utilisateur', 'Service']);

    this.makeServiceForm(null);

    this.list();

    this.listOfColumnHeadeer();

  }

  makeServiceForm(serviceB: ServiceB){
    this.validateServiceForm = this.fb.group({
      id: [serviceB != null ? serviceB.id : null],
      libelle: [serviceB != null ? serviceB.libelle : null,
        [Validators.required]],
    });
  }

  resetServiceForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateServiceForm.reset();
    for (const key in this.validateServiceForm.controls) {
      this.validateServiceForm.controls[key].markAsPristine();
      this.validateServiceForm.controls[key].updateValueAndValidity();
    }
    this.makeServiceForm(null);
    this.indexOfTab = 0;
    this.pageIndex = 1;
  }

  submitServiceForm(): void {
    for (const i in this.validateServiceForm.controls) {
      this.validateServiceForm.controls[i].markAsDirty();
      this.validateServiceForm.controls[i].updateValueAndValidity();
    }

    if (this.validateServiceForm.valid) {

      const formData = this.validateServiceForm.value;
      if (formData.id == null) {
        this.serviceBService.createService(formData).subscribe(
          (data: any) => {
            this.serviceList.unshift(data);
            //this.magasinList.push(data)
            this.serviceList = [...this.serviceList];
            this.listOfDisplayData = [...this.serviceList];
            this.makeServiceForm(null);

            console.log('Enregistrement ok');
            this.indexOfTab = 0;
            this.pageIndex = 1;

          },
          (error: HttpErrorResponse) => {
            console.log('Enregistrement non ok');

          });
      } else {
        const i = this.serviceList.findIndex(p => p.id == formData.id);
        this.serviceBService.updateService(formData).subscribe(
          (data: ServiceB) => {
            console.log(this.serviceList);
            console.log(data);
            this.serviceList[i] = data;
            this.serviceList = [...this.serviceList];
            this.listOfDisplayData = [...this.serviceList];
            console.log(this.serviceList);
            this.makeServiceForm(null);

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
    this.serviceBService.getList().subscribe(
      (data: Magasin[]) => {
        this.serviceList = data;
        console.log('Service List ==>', this.serviceList);
        this.listOfDisplayData = [...this.serviceList];
        this.pageIndex = 1;
      },
      (error: HttpErrorResponse) => {
        console.log('error getList Service ==>', error.message, ' ', error.status, ' ', error.statusText);
      });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.serviceList.filter((item: ServiceB) => item.libelle.indexOf(this.searchValue) !== -1);
  }

  updateForm(data: ServiceB){
    this.makeServiceForm(data);
    this.indexOfTab = 1;
  }

  confirmMsgDelete(data: ServiceB){
    this.serviceBService.deleteService(data.id).subscribe(
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

  listOfColumnHeadeer(){
    this.listOfColumn = [
      {
        title: 'Libellé',
        compare: null,
        sortFn: (a: ServiceB, b: ServiceB) => a.libelle.localeCompare(b.libelle),
      },
    ];
  }

}

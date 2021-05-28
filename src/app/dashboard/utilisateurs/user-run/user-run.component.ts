import {Component, OnInit} from '@angular/core';
import {BehaviorService} from '../../../services/common/behavior.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Magasin} from '../../../models/magasin';
import {Personne} from '../../../models/personne';
import {PersonneService} from '../../../services/dashboard/personne.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ProfilService} from '../../../services/dashboard/profil.service';
import {ServiceBService} from '../../../services/dashboard/service-b.service';
import {Profil} from '../../../models/profil';
import {ServiceB} from '../../../models/service-b';
import {Role} from 'src/app/models/role';
import {TokenService} from '../../../services/token/token.service';
import {Token} from '../../../models/token.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-user-run',
  templateUrl: './user-run.component.html',
  styleUrls: ['./user-run.component.css']
})
export class UserRunComponent implements OnInit {

  validatePersonneForm!: FormGroup;

  personneList: Personne[];
  profilList: Role[];
  serviceBList: ServiceB[];

  perso: Personne = new Personne();
  rolePersonne: Role;

  indexOfTab: number;
  listOfColumn: any = [];

  searchValueNom = '';
  searchValuePrenom = '';
  searchValueEmail = '';
  searchValueSexe = '';
  searchValueProfil = '';
  searchValueService = '';

  visibleNom = false;
  visiblePrenom = false;
  visibleEmail = false;
  visibleSexe = false;
  visibleProfil = false;
  visibleService = false;

  listOfDisplayData;
  pageIndex;

  token: Token;
  adminIsConnect: boolean;

  constructor(
    private behaviorService: BehaviorService,
    private fb: FormBuilder,
    private personneService: PersonneService,
    private profilService: ProfilService,
    private serviceBService: ServiceBService,
    private tokenService: TokenService,
    //private nzMessageService: NzMessageService
  ) {
    this.token = this.tokenService.getAccessToken();
  }


  ngOnInit(): void {
    this.behaviorService.setBreadcrumbItems(['Accueil', 'Gestion Utilisateur', 'User']);


    this.makePersonneForm(null);

    this.list();

    this.listOfColumnHeadeer();

    this.listProfil();
    this.listService();

    this.adminIsConnect = this.isAdmin();

  }

  isAdmin(): boolean {
    return this.token.roles.indexOf(environment.ROLE_ADMIN) > -1;
  }


  listProfil(): void {
    this.profilService.getList().subscribe(
      (data: Role[]) => {
        this.profilList = data;

        console.log('Profil List ==>', this.profilList);


        /*if (typeof this.rolePersonne == 'undefined')
          console.log('nest pas défini')

        if (typeof this.rolePersonne != 'undefined')
          console.log('est pas défini !!!')*/
        if (this.adminIsConnect == false) {
          for (let profil of this.profilList) {
            if (profil.name == 'ROLE_PERSONNE') {
              this.rolePersonne = new Role();
              this.rolePersonne = profil;
              this.perso.roles = [];
              this.perso.roles.push(this.rolePersonne);
              this.makePersonneForm(this.perso);
            }
          }
        }
        console.log(this.rolePersonne);

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

  makePersonneForm(personne: Personne) {
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
      /*roles: [personne != null ? personne.roles[0] : null,
        [Validators.required]],*/
      roles: [personne != null ? personne.roles : null,
        [Validators.required]],
      serviceB: [personne != null ? personne.serviceB : null,
        [Validators.required]],
      username: [personne != null ? personne.username : null],
      password: [personne != null ? personne.password : null],
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

      /*let role = new Role();
      role = formData.roles;

      formData.roles = [];
      formData.roles.push(role);*/


      /*let les_roles: Role[];
      les_roles = [...formData.roles];
      console.log(formData.roles);
      console.log('les roles 01');
      console.log(les_roles);*/


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

    } else {

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


  resetNom(): void {
    this.searchValueNom = '';
    this.searchNom();
  }

  searchNom(): void {
    this.visibleNom = false;
    this.listOfDisplayData = this.personneList.filter((item: Personne) => item.nom.indexOf(this.searchValueNom) !== -1);
  }

  resetPrenom(): void {
    this.searchValuePrenom = '';
    this.searchPrenom();
  }

  searchPrenom(): void {
    this.visiblePrenom = false;
    this.listOfDisplayData = this.personneList.filter((item: Personne) => item.prenom.indexOf(this.searchValuePrenom) !== -1);
  }

  resetEmail(): void {
    this.searchValueEmail = '';
    this.searchEmail();
  }

  searchEmail(): void {
    this.visibleEmail = false;
    this.listOfDisplayData = this.personneList.filter((item: Personne) => item.email.indexOf(this.searchValueEmail) !== -1);
  }

  resetSexe(): void {
    this.searchValueNom = '';
    this.searchSexe();
  }

  searchSexe(): void {
    this.visibleSexe = false;
    this.listOfDisplayData = this.personneList.filter((item: Personne) => item.sexe.indexOf(this.searchValueSexe) !== -1);
  }

  resetProfil(): void {
    this.searchValueProfil = '';
    this.searchProfil();
  }

  searchProfil(): void {
    this.visibleProfil = false;
    this.listOfDisplayData = this.personneList.filter((item: Personne) => item.profil.libelle.indexOf(this.searchValueProfil) !== -1);
  }

  resetService(): void {
    this.searchValueService = '';
    this.searchProfil();
  }

  searchService(): void {
    this.visibleService = false;
    this.listOfDisplayData = this.personneList.filter((item: Personne) => item.serviceB.libelle.indexOf(this.searchValueService) !== -1);
  }

  updateForm(data: Personne) {
    this.makePersonneForm(data);
    this.indexOfTab = 1;
  }

  confirmMsgDelete(data: Magasin) {
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

  listOfColumnHeadeer() {
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

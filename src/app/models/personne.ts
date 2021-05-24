import {Profil} from './profil';
import { Role } from './role';
import {ServiceB} from './service-b';

export class Personne {

  id: number;
  nom: string;
  prenom: string;
  sexe: string;
  email: string;
  profil: Profil;
  serviceB: ServiceB;
  username: String;
  password: String;
  roles: Array<Role>;

}

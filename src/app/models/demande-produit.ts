import {Demande} from './demande';
import {Produit} from './produit';
import {Marque} from './marque';
import {Modele} from './modele';
import {Gamme} from './gamme';
import {Personne} from './personne';

export class DemandeProduit {

  createdBy: string;
  createdDate: Date;
  lastModifiedBy: string;
  lastModifiedDate: Date;
  demande: Demande;
  description:	string;
  id: number;
  livrer: boolean;
  produit: Produit;
  valider: boolean;
  validateur: string;
  validationDate: Date;
  gestionnaire: string;
  dateLivraison: Date;

  marque: Marque;
  modele: Modele;
  gamme: Gamme;
  personne: Personne;


}

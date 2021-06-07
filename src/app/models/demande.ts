import {DemandeProduit} from './demande-produit';
import {Personne} from './personne';

export class Demande {

  dateHeure: Date;
  demandeProduits: DemandeProduit[];
  id: number;
  mouvement: string;
  personne: Personne;
  valider: boolean;
  url: string;

}

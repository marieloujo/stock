import {Produit} from './produit';

export class Gamme {

  id: number;
  libelle: string;
  description: string;
  nbrStock: number;
  produits: Produit[];

}

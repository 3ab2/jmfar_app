import { Ville } from './ville.model';
import { Evenement } from './evenement.model';

export interface Pay {
  id: number;
  code: string;
  nom: string;
  created_at: string;
  updated_at: string;
  villes?: Ville[];
  evenements?: Evenement[];
}

export interface CreatePayRequest {
  code: string;
  nom: string;
}

export interface UpdatePayRequest {
  code?: string;
  nom?: string;
}

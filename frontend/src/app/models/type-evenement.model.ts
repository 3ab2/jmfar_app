import { Evenement } from './evenement.model';
import { SousTypeEvenement } from './sous-type-evenement.model';

export interface TypeEvenement {
  id: number;
  label: string;
  created_at: string;
  updated_at: string;
  evenements?: Evenement[];
  sousTypes?: SousTypeEvenement[];
}

export interface CreateTypeEvenementRequest {
  label: string;
}

export interface UpdateTypeEvenementRequest {
  label?: string;
}

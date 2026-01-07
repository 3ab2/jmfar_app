import { TypeEvenement } from './type-evenement.model';
import { Evenement } from './evenement.model';

export interface SousTypeEvenement {
  id: number;
  label: string;
  type_evenement_id: number;
  created_at: string;
  updated_at: string;
  typeEvenement?: TypeEvenement;
  evenements?: Evenement[];
}

export interface CreateSousTypeEvenementRequest {
  label: string;
  type_evenement_id: number;
}

export interface UpdateSousTypeEvenementRequest {
  label?: string;
  type_evenement_id?: number;
}

import { Pay } from './pay.model';
import { Evenement } from './evenement.model';

export interface Ville {
  id: number;
  label: string;
  pays_id: number;
  created_at: string;
  updated_at: string;
  pay?: Pay;
  evenements?: Evenement[];
}

export interface CreateVilleRequest {
  label: string;
  pays_id: number;
}

export interface UpdateVilleRequest {
  label?: string;
  pays_id?: number;
}

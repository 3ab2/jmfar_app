import { Unite } from './unite.model';

export interface Arme {
  id: number;
  nom: string;
  description?: string;
  created_at: string;
  updated_at: string;
  unites?: Unite[];
}

export interface CreateArmeRequest {
  nom: string;
  description?: string;
}

export interface UpdateArmeRequest {
  nom?: string;
  description?: string;
}

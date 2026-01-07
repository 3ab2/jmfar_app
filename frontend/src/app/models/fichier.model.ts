import { Evenement } from './evenement.model';

export interface Fichier {
  id: number;
  nom: string;
  description?: string;
  taille?: number;
  date_upload: string;
  type?: string;
  path: string;
  created_at: string;
  updated_at: string;
  evenements?: Evenement[];
}

export interface CreateFichierRequest {
  nom?: string;
  description?: string;
  type?: string;
  path?: string;
}

export interface UpdateFichierRequest {
  nom?: string;
  description?: string;
  type?: string;
  path?: string;
}

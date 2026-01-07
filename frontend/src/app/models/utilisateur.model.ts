import { Unite } from './unite.model';
import { Evenement } from './evenement.model';

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
  unite_id: number;
  created_at: string;
  updated_at: string;
  unite?: Unite;
  evenements?: Evenement[];
}

export interface CreateUtilisateurRequest {
  nom: string;
  email: string;
  mot_de_passe: string;
  role?: 'admin' | 'user';
  avatar?: string;
  unite_id: number;
}

export interface UpdateUtilisateurRequest {
  nom?: string;
  email?: string;
  mot_de_passe?: string;
  role?: 'admin' | 'user';
  avatar?: string;
  unite_id?: number;
}

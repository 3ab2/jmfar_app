import { Arme } from './arme.model';
import { Utilisateur } from './utilisateur.model';

export interface Unite {
  id: number;
  nom: string;
  description?: string;
  arme_id: number;
  created_at: string;
  updated_at: string;
  arme?: Arme;
  utilisateurs?: Utilisateur[];
}

import { Utilisateur } from './utilisateur.model';
import { TypeEvenement } from './type-evenement.model';
import { SousTypeEvenement } from './sous-type-evenement.model';
import { Pay } from './pay.model';
import { Ville } from './ville.model';
import { Fichier } from './fichier.model';

export interface Evenement {
  id: number;
  reference: string;
  date_evenement: string;
  titre: string;
  description?: string;
  adresse?: string;
  utilisateur_id: number;
  type_evenement_id: number;
  sous_type_evenement_id?: number;
  pays_id: number;
  ville_id: number;
  created_at: string;
  updated_at: string;
  utilisateur?: Utilisateur;
  typeEvenement?: TypeEvenement;
  sousTypeEvenement?: SousTypeEvenement;
  pay?: Pay;
  ville?: Ville;
  fichiers?: Fichier[];
}

export interface CreateEvenementRequest {
  reference: string;
  date_evenement: string;
  titre: string;
  description?: string;
  adresse?: string;
  utilisateur_id: number;
  type_evenement_id: number;
  sous_type_evenement_id?: number;
  pays_id: number;
  ville_id: number;
}

export interface UpdateEvenementRequest {
  reference?: string;
  date_evenement?: string;
  titre?: string;
  description?: string;
  adresse?: string;
  utilisateur_id?: number;
  type_evenement_id?: number;
  sous_type_evenement_id?: number;
  pays_id?: number;
  ville_id?: number;
}

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ArmesListComponent } from './pages/armes/armes-list.component';
import { ArmeCreateComponent } from './pages/armes/arme-create.component';
import { ArmeEditComponent } from './pages/armes/arme-edit.component';

// TypeEvenement components
import { TypeEvenementsListComponent } from './pages/type-evenements/type-evenements-list.component';
import { TypeEvenementCreateComponent } from './pages/type-evenements/type-evenement-create.component';
import { TypeEvenementEditComponent } from './pages/type-evenements/type-evenement-edit.component';

// SousTypeEvenement components
import { SousTypeEvenementsListComponent } from './pages/sous-type-evenements/sous-type-evenements-list.component';
import { SousTypeEvenementCreateComponent } from './pages/sous-type-evenements/sous-type-evenement-create.component';
import { SousTypeEvenementEditComponent } from './pages/sous-type-evenements/sous-type-evenement-edit.component';

// Evenement components
import { EvenementsListComponent } from './pages/evenements/evenements-list.component';
import { EvenementCreateComponent } from './pages/evenements/evenement-create.component';
import { EvenementEditComponent } from './pages/evenements/evenement-edit.component';

// Fichier components
import { FichiersListComponent } from './pages/fichiers/fichiers-list.component';
import { FichierCreateComponent } from './pages/fichiers/fichier-create.component';
import { FichierEditComponent } from './pages/fichiers/fichier-edit.component';

// Utilisateur components
import { UtilisateursListComponent } from './pages/utilisateurs/utilisateurs-list.component';
import { UtilisateurCreateComponent } from './pages/utilisateurs/utilisateur-create.component';
import { UtilisateurEditComponent } from './pages/utilisateurs/utilisateur-edit.component';

// Pay components
import { PaysListComponent } from './pages/pays/pays-list.component';
import { PayCreateComponent } from './pages/pays/pay-create.component';
import { PayEditComponent } from './pages/pays/pay-edit.component';

// Ville components
import { VillesListComponent } from './pages/villes/villes-list.component';
import { VilleCreateComponent } from './pages/villes/ville-create.component';
import { VilleEditComponent } from './pages/villes/ville-edit.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Armes routes (existing)
  { path: 'armes', component: ArmesListComponent },
  { path: 'armes/create', component: ArmeCreateComponent },
  { path: 'armes/edit/:id', component: ArmeEditComponent },
  
  // TypeEvenement routes
  { path: 'type-evenements', component: TypeEvenementsListComponent },
  { path: 'type-evenements/create', component: TypeEvenementCreateComponent },
  { path: 'type-evenements/edit/:id', component: TypeEvenementEditComponent },
  
  // SousTypeEvenement routes
  { path: 'sous-type-evenements', component: SousTypeEvenementsListComponent },
  { path: 'sous-type-evenements/create', component: SousTypeEvenementCreateComponent },
  { path: 'sous-type-evenements/edit/:id', component: SousTypeEvenementEditComponent },
  
  // Evenement routes
  { path: 'evenements', component: EvenementsListComponent },
  { path: 'evenements/create', component: EvenementCreateComponent },
  { path: 'evenements/edit/:id', component: EvenementEditComponent },
  
  // Fichier routes
  { path: 'fichiers', component: FichiersListComponent },
  { path: 'fichiers/create', component: FichierCreateComponent },
  { path: 'fichiers/edit/:id', component: FichierEditComponent },
  
  // Utilisateur routes
  { path: 'utilisateurs', component: UtilisateursListComponent },
  { path: 'utilisateurs/create', component: UtilisateurCreateComponent },
  { path: 'utilisateurs/edit/:id', component: UtilisateurEditComponent },
  
  // Pay routes
  { path: 'pays', component: PaysListComponent },
  { path: 'pays/create', component: PayCreateComponent },
  { path: 'pays/edit/:id', component: PayEditComponent },
  
  // Ville routes
  { path: 'villes', component: VillesListComponent },
  { path: 'villes/create', component: VilleCreateComponent },
  { path: 'villes/edit/:id', component: VilleEditComponent },
  
  { path: '**', redirectTo: '/login' }
];

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
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

// Unite components
import { UnitesListComponent } from './pages/unites/unites-list.component';
import { UniteCreateComponent } from './pages/unites/unite-create.component';
import { UniteEditComponent } from './pages/unites/unite-edit.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/evenements', pathMatch: 'full' },
  
  // Armes routes (existing)
  { path: 'armes', component: ArmesListComponent, canActivate: [AuthGuard] },
  { path: 'armes/create', component: ArmeCreateComponent, canActivate: [AuthGuard] },
  { path: 'armes/edit/:id', component: ArmeEditComponent, canActivate: [AuthGuard] },
  
  // TypeEvenement routes
  { path: 'type-evenements', component: TypeEvenementsListComponent, canActivate: [AuthGuard] },
  { path: 'type-evenements/create', component: TypeEvenementCreateComponent, canActivate: [AuthGuard] },
  { path: 'type-evenements/edit/:id', component: TypeEvenementEditComponent, canActivate: [AuthGuard] },
  
  // SousTypeEvenement routes
  { path: 'sous-type-evenements', component: SousTypeEvenementsListComponent, canActivate: [AuthGuard] },
  { path: 'sous-type-evenements/create', component: SousTypeEvenementCreateComponent, canActivate: [AuthGuard] },
  { path: 'sous-type-evenements/edit/:id', component: SousTypeEvenementEditComponent, canActivate: [AuthGuard] },
  
  // Evenement routes
  { path: 'evenements', component: EvenementsListComponent, canActivate: [AuthGuard] },
  { path: 'evenements/create', component: EvenementCreateComponent, canActivate: [AuthGuard] },
  { path: 'evenements/edit/:id', component: EvenementEditComponent, canActivate: [AuthGuard] },
  
  // Fichier routes
  { path: 'fichiers', component: FichiersListComponent, canActivate: [AuthGuard] },
  { path: 'fichiers/create', component: FichierCreateComponent, canActivate: [AuthGuard] },
  { path: 'fichiers/edit/:id', component: FichierEditComponent, canActivate: [AuthGuard] },
  
  // Utilisateur routes
  { path: 'utilisateurs', component: UtilisateursListComponent, canActivate: [AuthGuard] },
  { path: 'utilisateurs/create', component: UtilisateurCreateComponent, canActivate: [AuthGuard] },
  { path: 'utilisateurs/edit/:id', component: UtilisateurEditComponent, canActivate: [AuthGuard] },
  
  // Pay routes
  { path: 'pays', component: PaysListComponent, canActivate: [AuthGuard] },
  { path: 'pays/create', component: PayCreateComponent, canActivate: [AuthGuard] },
  { path: 'pays/edit/:id', component: PayEditComponent, canActivate: [AuthGuard] },
  
  // Ville routes
  { path: 'villes', component: VillesListComponent, canActivate: [AuthGuard] },
  { path: 'villes/create', component: VilleCreateComponent, canActivate: [AuthGuard] },
  { path: 'villes/edit/:id', component: VilleEditComponent, canActivate: [AuthGuard] },
  
  // Unite routes
  { path: 'unites', component: UnitesListComponent, canActivate: [AuthGuard] },
  { path: 'unites/create', component: UniteCreateComponent, canActivate: [AuthGuard] },
  { path: 'unites/edit/:id', component: UniteEditComponent, canActivate: [AuthGuard] },
  
  { path: '**', redirectTo: '/login' }
];

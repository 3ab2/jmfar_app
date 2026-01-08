import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log('🔐 AuthGuard: Vérification de l\'authentification...');
    
    if (this.authService.isLoggedIn()) {
      console.log('✅ AuthGuard: Utilisateur authentifié, accès autorisé');
      return true;
    } else {
      console.log('❌ AuthGuard: Utilisateur non authentifié, redirection vers login');
      // Stocker l'URL demandée pour la redirection après login
      const returnUrl = route.url.join('/');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: returnUrl || '/evenements' } 
      });
      return false;
    }
  }
}

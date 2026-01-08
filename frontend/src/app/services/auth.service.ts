import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (!token) {
      this.isAuthenticatedSubject.next(false);
      return;
    }
    
    // Vérifier si le token est expiré
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        this.removeToken();
        this.removeUserData();
        this.isAuthenticatedSubject.next(false);
      } else {
        this.isAuthenticatedSubject.next(true);
      }
    } catch (error) {
      // Token invalide
      this.removeToken();
      this.removeUserData();
      this.isAuthenticatedSubject.next(false);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login`, { email, password }).pipe(
      map((response: any) => {
        if (response.token) {
          this.setToken(response.token);
          if (response.user) {
            this.setUserData(response.user);
          }
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.removeUserData();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getUserData(): any {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  private setUserData(userData: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  private removeUserData(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}

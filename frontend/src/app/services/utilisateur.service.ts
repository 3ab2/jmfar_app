import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Utilisateur, CreateUtilisateurRequest, UpdateUtilisateurRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/utilisateurs`);
  }

  getById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/utilisateurs/${id}`);
  }

  create(data: CreateUtilisateurRequest): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/utilisateurs`, data);
  }

  update(id: number, data: UpdateUtilisateurRequest): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/utilisateurs/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/utilisateurs/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SousTypeEvenement, CreateSousTypeEvenementRequest, UpdateSousTypeEvenementRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SousTypeEvenementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SousTypeEvenement[]> {
    return this.http.get<SousTypeEvenement[]>(`${this.apiUrl}/sous-type-evenements`);
  }

  getById(id: number): Observable<SousTypeEvenement> {
    return this.http.get<SousTypeEvenement>(`${this.apiUrl}/sous-type-evenements/${id}`);
  }

  create(data: CreateSousTypeEvenementRequest): Observable<SousTypeEvenement> {
    return this.http.post<SousTypeEvenement>(`${this.apiUrl}/sous-type-evenements`, data);
  }

  update(id: number, data: UpdateSousTypeEvenementRequest): Observable<SousTypeEvenement> {
    return this.http.put<SousTypeEvenement>(`${this.apiUrl}/sous-type-evenements/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sous-type-evenements/${id}`);
  }

  getByTypeEvenementId(typeEvenementId: number): Observable<SousTypeEvenement[]> {
    return this.http.get<SousTypeEvenement[]>(`${this.apiUrl}/type-evenements/${typeEvenementId}/sous-types`);
  }
}

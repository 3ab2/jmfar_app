import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TypeEvenement, CreateTypeEvenementRequest, UpdateTypeEvenementRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TypeEvenementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypeEvenement[]> {
    return this.http.get<TypeEvenement[]>(`${this.apiUrl}/type-evenements`);
  }

  getById(id: number): Observable<TypeEvenement> {
    return this.http.get<TypeEvenement>(`${this.apiUrl}/type-evenements/${id}`);
  }

  create(data: CreateTypeEvenementRequest): Observable<TypeEvenement> {
    return this.http.post<TypeEvenement>(`${this.apiUrl}/type-evenements`, data);
  }

  update(id: number, data: UpdateTypeEvenementRequest): Observable<TypeEvenement> {
    return this.http.put<TypeEvenement>(`${this.apiUrl}/type-evenements/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/type-evenements/${id}`);
  }
}

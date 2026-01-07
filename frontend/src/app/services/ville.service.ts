import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ville, CreateVilleRequest, UpdateVilleRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VilleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ville[]> {
    return this.http.get<Ville[]>(`${this.apiUrl}/villes`);
  }

  getById(id: number): Observable<Ville> {
    return this.http.get<Ville>(`${this.apiUrl}/villes/${id}`);
  }

  create(data: CreateVilleRequest): Observable<Ville> {
    return this.http.post<Ville>(`${this.apiUrl}/villes`, data);
  }

  update(id: number, data: UpdateVilleRequest): Observable<Ville> {
    return this.http.put<Ville>(`${this.apiUrl}/villes/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/villes/${id}`);
  }
}

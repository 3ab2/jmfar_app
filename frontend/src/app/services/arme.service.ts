import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Arme, CreateArmeRequest, UpdateArmeRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ArmeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Arme[]> {
    return this.http.get<Arme[]>(`${this.apiUrl}/armes`);
  }

  getById(id: number): Observable<Arme> {
    return this.http.get<Arme>(`${this.apiUrl}/armes/${id}`);
  }

  create(data: CreateArmeRequest): Observable<Arme> {
    return this.http.post<Arme>(`${this.apiUrl}/armes`, data);
  }

  update(id: number, data: UpdateArmeRequest): Observable<Arme> {
    return this.http.put<Arme>(`${this.apiUrl}/armes/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/armes/${id}`);
  }
}

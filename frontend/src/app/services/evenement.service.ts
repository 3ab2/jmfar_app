import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Evenement, CreateEvenementRequest, UpdateEvenementRequest, Fichier } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/evenements`);
  }

  getById(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.apiUrl}/evenements/${id}`);
  }

  create(data: CreateEvenementRequest): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiUrl}/evenements`, data);
  }

  update(id: number, data: UpdateEvenementRequest): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.apiUrl}/evenements/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/evenements/${id}`);
  }

  // Special method for attaching files to events
  attachFile(evenementId: number, fichierId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/evenements/${evenementId}/fichiers`, { fichier_id: fichierId });
  }

  // Special method for detaching files from events
  detachFile(evenementId: number, fichierId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/evenements/${evenementId}/fichiers/${fichierId}`);
  }

  // Upload file for event
  uploadFile(evenementId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/evenements/${evenementId}/upload`, formData);
  }

  // Get event files
  getEventFiles(evenementId: number): Observable<Fichier[]> {
    return this.http.get<Fichier[]>(`${this.apiUrl}/evenements/${evenementId}/fichiers`);
  }
}

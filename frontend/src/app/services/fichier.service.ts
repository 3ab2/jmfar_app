import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Fichier, CreateFichierRequest, UpdateFichierRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FichierService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fichier[]> {
    return this.http.get<Fichier[]>(`${this.apiUrl}/fichiers`);
  }

  getById(id: number): Observable<Fichier> {
    return this.http.get<Fichier>(`${this.apiUrl}/fichiers/${id}`);
  }

  create(data: CreateFichierRequest): Observable<Fichier> {
    return this.http.post<Fichier>(`${this.apiUrl}/fichiers`, data);
  }

  update(id: number, data: UpdateFichierRequest): Observable<Fichier> {
    return this.http.put<Fichier>(`${this.apiUrl}/fichiers/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fichiers/${id}`);
  }

  // Upload file
  uploadFile(file: File): Observable<Fichier> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Fichier>(`${this.apiUrl}/fichiers/upload`, formData);
  }

  // Download file
  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/fichiers/${id}/download`, { responseType: 'blob' });
  }

  // Get file URL for display
  getFileUrl(id: number): string {
    return `${this.apiUrl}/fichiers/${id}/download`;
  }
}

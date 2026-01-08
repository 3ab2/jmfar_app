import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Unite } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UniteService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Unite[]> {
    return this.http.get<Unite[]>(`${this.apiUrl}/unites`);
  }

  getById(id: number): Observable<Unite> {
    return this.http.get<Unite>(`${this.apiUrl}/unites/${id}`);
  }

  create(data: any): Observable<Unite> {
    return this.http.post<Unite>(`${this.apiUrl}/unites`, data);
  }

  update(id: number, data: any): Observable<Unite> {
    return this.http.put<Unite>(`${this.apiUrl}/unites/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/unites/${id}`);
  }
}

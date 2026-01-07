import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pay, CreatePayRequest, UpdatePayRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PayService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pay[]> {
    return this.http.get<Pay[]>(`${this.apiUrl}/pays`);
  }

  getById(id: number): Observable<Pay> {
    return this.http.get<Pay>(`${this.apiUrl}/pays/${id}`);
  }

  create(data: CreatePayRequest): Observable<Pay> {
    return this.http.post<Pay>(`${this.apiUrl}/pays`, data);
  }

  update(id: number, data: UpdatePayRequest): Observable<Pay> {
    return this.http.put<Pay>(`${this.apiUrl}/pays/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pays/${id}`);
  }
}

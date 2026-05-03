import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entry } from '../dto/journal.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private baseUrl = '/api/entries';

  constructor(private http: HttpClient) {}

  getByUser(userId: number): Observable<Entry[]> {
    return this.http.get<Entry[]>(`${this.baseUrl}/user/${userId}`);
  }

  create(entry: any): Observable<any> {
    return this.http.post(this.baseUrl, entry);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}

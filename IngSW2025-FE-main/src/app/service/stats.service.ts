import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stats } from '../dto/stats.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {

  constructor(private http: HttpClient) {}

  getStats(userId: string): Observable<Stats> {
    return this.http.get<Stats>(`/api/stats/user/${userId}`);
  }

  unfriend(): Observable<void> {
    return this.http.post<void>('/api/partner/unfriend', {});
  }

  addPartner(code: string): Observable<void> {
    return this.http.post<void>('/api/partner/add', { code });
  }
}

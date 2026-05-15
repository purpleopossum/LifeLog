import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stats } from '../dto/stats.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {
    apiUrl = "/api/stats"

  constructor(private http: HttpClient) {}

  getStats(userId: string): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/user/${userId}`);
  }

  getByHabitId(habitId: string): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/habit/${habitId}`);
  }
}

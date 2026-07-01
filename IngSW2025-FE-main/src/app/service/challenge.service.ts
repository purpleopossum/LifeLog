import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Challenge, Milestone } from '../dto/challenge.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private apiUrl = '/api/challenges';

  constructor(private http: HttpClient) {}

  getChallenges(userId: string): Observable<Challenge[]> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Challenge[]>(this.apiUrl, { params });
  }

  toggleMilestone(milestoneId: number, userId: string): Observable<Milestone> {
    const params = new HttpParams().set('userId', userId);
    return this.http.patch<Milestone>(`${this.apiUrl}/milestones/${milestoneId}`, {}, { params });
  }

  createChallenge(userId: string, challenge: Challenge): Observable<Challenge> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<Challenge>(this.apiUrl, challenge, { params });
  }

  deleteChallenge(challengeId: number, userId: string): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.delete<void>(`${this.apiUrl}/${challengeId}`, { params });
  }

  updateChallenge(challengeId: number, userId: string, updateChallenge: Challenge): Observable<Challenge> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put<Challenge>(`${this.apiUrl}/${challengeId}`, updateChallenge, { params });
  }
}

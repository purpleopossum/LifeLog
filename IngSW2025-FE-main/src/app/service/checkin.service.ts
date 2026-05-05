import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Checkin } from '../dto/checkin.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckinService {
  private apiUrl = '/api/checkins';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Checkin[]> {
    return this.http.get<Checkin[]>(this.apiUrl);
  }

  create(habitId: string, checkin: any): Observable<Checkin> {
    return this.http.post<Checkin>(`${this.apiUrl}?habitId=${habitId}`, checkin);
  }

  getByHabitAndDate(habitId: string, date: string): Observable<Checkin> {
    return this.http.get<Checkin>(`${this.apiUrl}/habit/${habitId}/date/${date}`);
  }
 
  getByUserAndDate(userId: string, date: string): Observable<Checkin[]>{
    return this.http.get<Checkin[]>(`${this.apiUrl}/user/${userId}/date/${date}`, );
  }

  getByUser(userId: string): Observable<Checkin[]>{
    return this.http.get<Checkin[]>(`${this.apiUrl}/user/${userId}`, );
  }

  update(id: string, checkin: any): Observable<Checkin> {
      const payload = {
          status: checkin.status,
          note: checkin.note,
          mood: checkin.mood
      }
      return this.http.put<Checkin>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

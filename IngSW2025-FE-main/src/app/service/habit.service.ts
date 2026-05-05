import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habit, HabitUpdateDTO } from '../dto/habit.model';
@Injectable({
  providedIn: 'root'
})
export class HabitService {

  private apiUrl = '/api/habits';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Habit[]> {
    return this.http.get<Habit[]>(this.apiUrl);
  }

  getById(id: string): Observable<Habit> {
    return this.http.get<Habit>(`${this.apiUrl}/${id}`);
  }

  getByUserId(userId: string): Observable<Habit[]> {
    return this.http.get<Habit[]>(`${this.apiUrl}/user/${userId}`);
  }


  create(habit: HabitUpdateDTO): Observable<Habit> {
    return this.http.post<Habit>(`${this.apiUrl}`, habit);
  }

  update(id: string, habit: HabitUpdateDTO): Observable<Habit> {
    return this.http.put<Habit>(`${this.apiUrl}/${id}`, habit);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

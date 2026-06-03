import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncouragementMessageType, User } from '../dto/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`);
  }

  getEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/email/${email}`);
  }

  create(entity: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, entity);
  }

  update(id: string, entity: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
  setMessage(id: string, message: EncouragementMessageType) {
      return this.http.put(
        `${this.apiUrl}/${id}/message`,
        JSON.stringify(message),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  clearMessage(id: string): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/${id}/message`);
  }
}

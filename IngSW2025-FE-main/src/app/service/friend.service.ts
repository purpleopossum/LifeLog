import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Friendship } from '../dto/friend.model';
@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private apiUrl = '/api/friends';

  constructor(private http: HttpClient) {}

  request(senderId: string, friendCode: string): Observable<Friendship> {
    return this.http.post<Friendship>(
        `${this.apiUrl}/request`, {
            senderId,
            friendCode
        }
    );
  }

  accept(id: string): Observable<Friendship> {
    return this.http.put<Friendship>(`${this.apiUrl}/${id}/accept`, {});
  }

  reject(id: string): Observable<Friendship> {
    return this.http.put<Friendship>(`${this.apiUrl}/${id}/reject`, {});
  }

  getFriend(userId: string): Observable<Friendship> {
      return this.http.get<Friendship>(`${this.apiUrl}/user/${userId}`);
  }

  getPending(userId: string): Observable<Friendship[]> {
      return this.http.get<Friendship[]>(`${this.apiUrl}/pending/${userId}`);
  }
}

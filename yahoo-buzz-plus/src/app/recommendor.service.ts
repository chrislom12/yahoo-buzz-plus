
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
    private baseUrl = environment.baseUrl;
    private apiUrl = this.baseUrl + '/api/recommend/';

  constructor(private http: HttpClient) {}

  getRecommendations(feedback: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, feedback);
  }
}

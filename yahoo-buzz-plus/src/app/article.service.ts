// src/app/article.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private baseUrl = environment.baseUrl;
  private apiUrl = this.baseUrl + '/api/getarticles/'; // Adjust the URL if needed

  constructor(private http: HttpClient) {}

  getArticles(): Observable<string> {
    return this.http.get(this.apiUrl, { responseType: 'text' });
  }
}

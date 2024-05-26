
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MisinformationService {
    baseUrl = environment.baseUrl;
    apiUrl = this.baseUrl + '/api/detectMisinformation/';

  constructor(private http: HttpClient) {}

  detectMisinformation(feedback: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, feedback);
  }
}

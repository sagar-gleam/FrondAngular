import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'
import { apiConfig } from '../../environments/apiConfig';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = apiConfig.RegisterApi;

  constructor(private http: HttpClient) {}

  saveData(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

}

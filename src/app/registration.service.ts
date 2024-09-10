import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:4000/api/signup/savedata';

  constructor(private http: HttpClient) {}

  saveData(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}

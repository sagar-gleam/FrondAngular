import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:4100/api/signup/savedata';

  constructor(private http: HttpClient) {}

  saveData(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }


}

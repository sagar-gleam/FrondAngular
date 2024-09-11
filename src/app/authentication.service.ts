import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError, catchError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = 'http://localhost:4100/api/signup/login'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // login(credentials: { email: string; password: string }): Observable<any> {
  //   return this.http.post<any>(this.apiUrl, credentials);
  // }
  login(credentials: any) {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', "true"); // Store token on successful login
      })
    );
  }

  logout(): void {
    // Optionally perform any additional logout operations here
    // For example, you might want to make a request to the server to invalidate the token
    localStorage.clear()
  }

  getUser(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:4100/api/signup/getdata').pipe(
      catchError((error) => {
        console.error('Error fetching students data:', error);
        return throwError(() => new Error('Failed to fetch usr data'));
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError, catchError } from 'rxjs';
import { apiConfig } from '../../environments/apiConfig';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post(apiConfig.LoginApi, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('authToken', "true"); // Store token on successful login
      })
    );
  }

  logout(): void {
    localStorage.clear()
  }
  

  getUser(): Observable<any[]> {
    return this.http.get<any[]>(apiConfig.SignupGetData).pipe(
      catchError((error) => {
        console.error('Error fetching students data:', error);
        return throwError(() => new Error('Failed to fetch usr data'));
      })
    );
  }

  updateUserPermissionsBatch(permissionsPayload: any[]): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
  
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
  
    return this.http.put(apiConfig.UpdatePermission, permissionsPayload, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`, // Set the Authorization header
      },
    }).pipe(
      catchError((error) => {
        console.error('Error updating permissions:', error);
        return throwError(() => new Error('Failed to update permissions'));
      })
    );
  }
  

 
}

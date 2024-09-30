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
  private apiUrl1 = 'http://localhost:4100/api/admin/user-role'; 

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

  promoteToAdmin(userId: string): Observable<void> {
    console.log('User ID:', userId); // Log the user ID to check its value
  
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
  
    return this.http.put<void>(`http://localhost:4100/api/signup/promote/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    }).pipe(
      catchError((error) => {
        console.error('Error promoting user to admin:', error);
        return throwError(() => new Error('Failed to promote user to admin'));
      })
    );
  }

  removeAdmin(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    return this.http.put(`http://localhost:4100/api/signup/remove-admin/${userId}`, {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }).pipe(
        catchError((error) => {
          console.error('Error promoting user to admin:', error);
          return throwError(() => new Error('Failed to promote user to admin'));
        })
      );
  }

  grantReadPermission(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    return this.http.put(`http://localhost:4100/api/signup/grant-read-permission/${userId}`, {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }).pipe(
        catchError((error) => {
          console.error('Error promoting user to admin:', error);
          return throwError(() => new Error('Failed to promote user to admin'));
        })
    );
  }

  grantWritePermission(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    return this.http.put(`http://localhost:4100/api/signup/grant-write-permission/${userId}`, {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }).pipe(
        catchError((error) => {
          console.error('Error promoting user to admin:', error);
          return throwError(() => new Error('Failed to promote user to admin'));
        })
    );
  }

  grantDeletePermission(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    return this.http.put(`http://localhost:4100/api/signup/grant-delete-permission/${userId}`, {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }).pipe(
        catchError((error) => {
          console.error('Error promoting user to admin:', error);
          return throwError(() => new Error('Failed to promote user to admin'));
        })
    );
  }

  revokeReadPermission(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    return this.http.patch(`http://localhost:4100/api/signup/grant-revoke-read/${userId}`, {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }).pipe(
        catchError((error) => {
          console.error('Error promoting user to admin:', error);
          return throwError(() => new Error('Failed to promote user to admin'));
        })
    );
  }

  revokeWritePermission(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    return this.http.patch(`http://localhost:4100/api/signup/grant-revoke-write/${userId}`, {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }).pipe(
        catchError((error) => {
          console.error('Error promoting user to admin:', error);
          return throwError(() => new Error('Failed to promote user to admin'));
        })
    );
  } 

  revokeDeletePermission(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }
    return this.http.patch(`http://localhost:4100/api/signup//grant-revoke-delete/${userId}`, {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }).pipe(
        catchError((error) => {
          console.error('Error promoting user to admin:', error);
          return throwError(() => new Error('Failed to promote user to admin'));
        })
    );
  }  
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiUrl = 'http://localhost:4100/api/studnets/getdata';
  private baseUrl = 'http://localhost:4100/api/studnets';

  constructor(private http: HttpClient) {}

  // Function to get the token from localStorage
  private getToken(): string | null {
    const token = localStorage.getItem('token');
    
    // Check if token is not null before parsing
    if (token) {
      return JSON.parse(token);
    }
    
    return null; // Return null if no token is found
  }
  
  // Helper method to set headers
  private getHeaders(): HttpHeaders {
    const token = this.getToken();

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  addStudent(student: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/savedata`, student, {
      headers: this.getHeaders()
    });
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Error fetching students data:', error);
        return throwError(() => new Error('Failed to fetch students data'));
      })
    );
  }

  updateStudent(id: string, student: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, student, {
      headers: this.getHeaders()
    });
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, {
      headers: this.getHeaders()
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiConfig } from '../../environments/apiConfig';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

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
    return this.http.post<any>(apiConfig.AddStudent, student, {
      headers: this.getHeaders()
    });
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(apiConfig.GetStudent, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error) => {
        console.error('Error fetching students data:', error);
        return throwError(() => new Error('Failed to fetch students data'));
      })
    );
  }

  updateStudent(id: string, student: any): Observable<any> {
    return this.http.put<any>(`${apiConfig.UpdateStudent}/${id}`, student, {
      headers: this.getHeaders()
    });
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete<void>(`${apiConfig.DeleteStudent}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

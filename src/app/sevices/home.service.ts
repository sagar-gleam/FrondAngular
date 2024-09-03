import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiUrl = 'https://nodedb-486k.onrender.com/api/studnets/getdata';
  private baseUrl = 'https://nodedb-486k.onrender.com/api/studnets';

  constructor(private http: HttpClient) {}

  addStudent(student: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/savedata`, student);
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching students data:', error);
        return throwError(() => new Error('Failed to fetch students data'));
      })
    );
  }

  updateStudent(id: string, student: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, student);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  constructor() { }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken'); // or any other logic to check authentication
  }

  login(credentials: any) {
    // Your login logic, which might store token on success
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../sevices/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null; // Property to store the error message
   private adminEmail = 'admin@example.com'; 

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin@gmail.com', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]], // Email pattern
      password: ['123', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      this.authenticationService.login(this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            console.log('Login successful', response);
            localStorage.setItem('token', JSON.stringify(response.token));
            localStorage.setItem('user', JSON.stringify(response.user));
            this.loginError = null; // Clear any previous errors
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'You have logged in successfully.'
            });
            
            setTimeout(() => {
              this.router.navigate(['/home']); 
            }, 500);
          // Navigate to the home page on success
          },
          error: (error: any) => {
            console.error('Login error', error);
            // Set the error message based on the response
            if (error.status === 401 || error.status === 400) {
              this.loginError = 'Invalid email or password. Please try again.';
            } else {
              this.loginError = 'An unexpected error occurred. Please try again later.';
            }
          }
        });
    }
  }
}

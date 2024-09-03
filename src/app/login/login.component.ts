import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null; // Property to store the error message

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      this.authenticationService.login(this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            console.log('Login successful', response);
            localStorage.setItem('user', JSON.stringify(this.loginForm.value));
            this.loginError = null; // Clear any previous errors
            this.router.navigate(['/home']); // Navigate to the home page on success
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

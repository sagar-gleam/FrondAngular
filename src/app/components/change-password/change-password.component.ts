import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordChangeForm!: FormGroup;
  passwordMismatch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.passwordChangeForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;
    if (newPassword !== confirmNewPassword) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.passwordChangeForm.invalid) {
      return;
    }
  
    const { currentPassword, newPassword } = this.passwordChangeForm.value;
  
    const token = localStorage.getItem('token'); // Or however you store your token
    console.log(token,"tokakakn")
    if (!token) {
      this.snackBar.open('No authentication token found', 'Close', { duration: 3000 });
      return;
    }
  
    this.http.post('http://localhost:4100/api/signup/change-password', {
      oldPassword: currentPassword,
      newPassword: newPassword,
      confirmPassword: newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token.replace(/"/g, '')}`
      }
    }).subscribe({
      next: (response) => {
        this.snackBar.open('Password updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
        this.passwordChangeForm.reset();
      },
      error: (error) => {
        this.snackBar.open('Error updating password: ' + error.error.message, 'Close', { duration: 3000 });
      }
    });
  }
  onBack(): void {
    this.router.navigate(['/home']); // Replace with your desired route
  }
  
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../registration.service'; // Import the service
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'] // Corrected from styleUrl to styleUrls
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup; // Non-null assertion operator

  constructor(private fb: FormBuilder, private registrationService: RegistrationService, private router: Router,  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      mobileNumber: ['', Validators.required],
      address: [''],
      dob: ['', Validators.required],
      role: ['user'],
      permissions: this.fb.group({
        read: [false],
        write: [false]
      })
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);

      // Use the service to post the form data
      this.registrationService.saveData(this.registrationForm.value)
        .subscribe({
          next: (response: any) => {
            console.log('Data saved successfully', response);
            alert('Data saved successfully')
            this.router.navigate(['/login']);
            // this.registrationForm.reset();
          },
          error: (error: any) => {
            console.error('Error saving data', error);
          }
        });
    }
  }
}

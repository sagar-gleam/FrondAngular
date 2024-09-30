import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../sevices/registration.service'; // Import the service
import { Router } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'] // Corrected from styleUrl to styleUrls
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup; // Non-null assertion operator

  constructor(private fb: FormBuilder , private primengConfig: PrimeNGConfig, private registrationService: RegistrationService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]], // Email pattern
      password: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // 10 digit mobile number
      address: [''],
      dob: ['', Validators.required],
      role: ['user'],
      permissions: this.fb.group({
        read: [false],
        write: [false]
      })
    });
    this.primengConfig.ripple = true;
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);

      // Use the service to post the form data
      this.registrationService.saveData(this.registrationForm.value)
        .subscribe({
          next: (response: any) => {
            console.log('Data saved successfully', response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data Registered Successfully'
            });
            
            setTimeout(() => {
            this.router.navigate(['/login']);  
            }, 1000);
            // this.registrationForm.reset();
          },
          error: (error: any) => {
            console.error('Error saving data', error);
          }
        });
    }
  }
}

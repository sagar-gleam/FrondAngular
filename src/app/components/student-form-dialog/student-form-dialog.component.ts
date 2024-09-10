import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeService } from '../../sevices/home.service';

@Component({
  selector: 'app-student-form-dialog',
  templateUrl: './student-form-dialog.component.html',
  styleUrls: ['./student-form-dialog.component.css']
})
export class StudentFormDialogComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentService: HomeService
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      address: [''],
      dob: ['']
    });

    if (data) {
      this.isEditMode = true;
      this.studentForm.patchValue(data);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.studentForm.valid) {
      if (this.isEditMode) {
        this.studentService.updateStudent(this.data._id, this.studentForm.value).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('There was an error!', error)
        });
      } else {
        this.studentService.addStudent(this.studentForm.value).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('There was an error!', error)
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

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
  selectedFile: File | null = null;

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
      dob: [''],
    });

    if (data) {
      this.isEditMode = true;
      this.studentForm.patchValue(data);
    }
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = new FormData();
      Object.keys(this.studentForm.controls).forEach(key => {
        formData.append(key, this.studentForm.get(key)?.value);
      });
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }
  
      if (this.isEditMode) {
        this.studentService.updateStudent(this.data._id, formData).subscribe({
          next: () => this.dialogRef.close(true),
          error: (error) => console.error('There was an error!', error)
        });
      } else {
        this.studentService.addStudent(formData).subscribe({
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

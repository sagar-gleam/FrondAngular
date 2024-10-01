import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeService } from '../../sevices/home.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-student-form-dialog',
  templateUrl: './student-form-dialog.component.html',
  styleUrls: ['./student-form-dialog.component.css']
})
export class StudentFormDialogComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode: boolean = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  currentImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentService: HomeService,
    private messageService: MessageService
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]], 
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      dob: ['', Validators.required],
    });

    if (data) {
      this.isEditMode = true;
      this.studentForm.patchValue(data);

      this.currentImage = data.image; // Current image path
      this.imagePreview = 'http://localhost:4100/' + this.currentImage;

    }
  }

  ngOnInit(): void {}
  

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // Preview the new image
      };
      reader.readAsDataURL(this.selectedFile!);
    } else {
      this.selectedFile = null; // No file selected
      this.imagePreview = this.currentImage; // Reset to current image
    }
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const formData = new FormData();
      Object.keys(this.studentForm.controls).forEach(key => {
        const value = this.studentForm.get(key)?.value;
        formData.append(key, value);
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }
      const request$ = this.isEditMode
        ? this.studentService.updateStudent(this.data._id, formData)
        : this.studentService.addStudent(formData);

      request$.subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: this.isEditMode ? 'Student updated successfully!' : 'Student added successfully!' });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('There was an error!', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There was an error processing your request.' });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

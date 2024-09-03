import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../sevices/home.service';
import { MatDialog } from '@angular/material/dialog';
import { StudentFormDialogComponent } from '../student-form-dialog/student-form-dialog.component';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  students: any[] = [];
  errorMessage: string = '';
  displayedColumns: string[] = ['id', 'name', 'email', 'mobileNumber', 'address', 'dob', 'actions'];
  userEmail: string = '';

  constructor(private studentService: HomeService, private dialog: MatDialog, private serlogout: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.fetchStudentsData();
    this.getUserInfo();
  }

  getUserInfo(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Assume user details are stored in local storage
    console.log(user)
    this.userEmail = user.email || 'Guest'; // Default to 'Guest' if no user info
  }


  onAddItem(): void {
    const dialogRef = this.dialog.open(StudentFormDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchStudentsData(); // Refresh data after adding
      }
    });
  }

  onEdit(student: any): void {
    const dialogRef = this.dialog.open(StudentFormDialogComponent, {
      data: student
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchStudentsData(); // Refresh data after editing
      }
    });
  }

  onLogout(){
    this.serlogout.logout();
    this.router.navigate(['/login']);
  }

  onDelete(student: any): void {
    if (confirm(`Are you sure you want to delete student with ID ${student._id}?`)) {
      this.studentService.deleteStudent(student._id).subscribe({
        next: () => {
          this.fetchStudentsData(); // Refresh data after deleting
        },
        error: (error) => {
          this.errorMessage = 'Could not delete student data.';
          console.error('There was an error!', error);
        }
      });
    }
  }

  fetchStudentsData(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (error) => {
        this.errorMessage = 'Could not load student data.';
        console.error('There was an error!', error);
      }
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../../sevices/home.service';
import { MatDialog } from '@angular/material/dialog';
import { StudentFormDialogComponent } from '../student-form-dialog/student-form-dialog.component';
import { AuthenticationService } from '../../sevices/authentication.service';
import { Router } from '@angular/router'; // Import Router for navigation
import { PrimeIcons, MenuItem, PrimeNGConfig, ConfirmationService } from 'primeng/api';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MessageService} from 'primeng/api';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];
  errorMessage: string = '';
  layout: any = 'list';
  displayedColumns: string[] = ['id', 'image', 'name', 'email', 'mobileNumber', 'address', 'dob', 'actions'];
  userEmail: string = '';
  searchTerm: string = ''; 
  dataSource = new MatTableDataSource<any>([]);
  loading: boolean = false; 
  userRole: String = '';
  permissions: any;
  currentCount: number = 12;
  
  

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  

  constructor(private studentService: HomeService, private dialog: MatDialog, private serlogout: AuthenticationService, private router: Router, 
    private messageService: MessageService, private primengConfig: PrimeNGConfig,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchStudentsData();
    this.getUserInfo();
    this.primengConfig.ripple = true;
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getUserInfo(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Assume user details are stored in local storage
    this.userEmail = user.email || 'Guest'; // Default to 'Guest' if no user info
    this.userRole = user.role;
  
    // If the user is an admin, grant all permissions
    if (this.userRole === 'admin') {
      this.permissions = {
        read: true,
        write: true,
        delete: true
      };
    } else {
      this.permissions = user.permissions || {}; // Get permissions for non-admin users
    }
  
    // Remove action column if the user only has read permission
    if (!this.permissions.write && !this.permissions.delete) {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'actions');
    }
  }
  getImageUrl(student: any): string {
    const baseUrl = 'http://localhost:4100/';
    return student.image ? baseUrl + student.image : "assets/avatar.png'";
  }

  
  
  
  confirm2(student: any) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete student with name ${student.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.studentService.deleteStudent(student._id).subscribe({
          next: () => {
            this.fetchStudentsData(); // Refresh data after deleting
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Deleted successfully' });
          },
          error: (error) => {
            this.errorMessage = 'Could not delete student data.';
            console.error('There was an error!', error);
          }
        });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'Deletion cancelled' });
      }
    });
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

  changePassword(): void {
    this.router.navigate(['/change-password']); // Adjust route if needed
  }

  userProfile(): void{
    this.router.navigate(['/user-profile']); 
  }

  onDelete(student: any): void {
    if (confirm(`Are you sure you want to delete student with ID ${student._id}?`)) {
      this.studentService.deleteStudent(student._id).subscribe({
        next: () => {
          this.fetchStudentsData(); // Refresh data after deleting
          this.messageService.add({severity:'success', summary: 'success', detail: 'Delete successfully'});
        },
        error: (error) => {
          this.errorMessage = 'Could not delete student data.';
          console.error('There was an error!', error);
        }
      });
    }
  }

  fetchStudentsData(): void {
    this.loading = true;
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = data.slice(0, this.currentCount);
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Could not load student data. Please try again later.';
        console.error('Error fetching student data:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errorMessage });
      }
    });
  }
  
  loadMore(): void {
    if (this.currentCount < this.students.length) {
     
      this.currentCount += 12; // Increase count
      this.filteredStudents = this.students.slice(0, this.currentCount); // Update displayed students
    }
  }
  onSearch(): void {
    if (this.searchTerm) {
      // Filter the students based on the search term
      this.filteredStudents = this.students.filter(student =>
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // If no search term, reset the filtered students to all students
      this.filteredStudents = this.students;
    }
  
    // Update the data source with the filtered students
    this.dataSource.data = this.filteredStudents;
  }
  getIndex(index: number): number {
    if (this.paginator) {
      return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
    }
    return index + 1;
  }

  showUsers(): void {
    this.router.navigate(['/user-management']);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../sevices/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['email', 'role', 'permissions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  users: any[] = [];
  filteredUsers: any[] = [];
  loggedInUser: any; // Store logged-in user details
  roles = ['user', 'admin']; // Possible roles
  isUpdating: boolean = false; // Flag to disable the Update All button

  constructor(
    private userService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getLoggedInUser();
    this.fetchUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  getLoggedInUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.loggedInUser = JSON.parse(storedUser);
    }
  }

  fetchUsers(): void {
    this.userService.getUser().subscribe((data: any[]) => {
      this.users = data;
      this.filteredUsers = this.users.filter(user => user._id !== this.loggedInUser._id);
  
      this.filteredUsers.forEach(user => {
        user.permissions = user.role === 'admin' 
          ? { read: true, write: true, delete: true }
          : { read: true, write: user.permissions?.write || false, delete: user.permissions?.delete || false };
      });

      // Show only the first 10 users
      this.dataSource.data = this.filteredUsers // Limit to first 10 users
    });
  }
  
  onRoleChange(user: any, event: any): void {
    user.role = event.value; // Update user role directly on change

    // Set permissions based on the new role
    if (user.role === 'admin') {
      user.permissions = { read: true, write: true, delete: true }; // Admin has all permissions
    } else {
      user.permissions = { read: true, write: false, delete: false }; // Default permissions for non-admin
    }

    this.isUpdating = true; // Disable the button when changing roles
  }

  onPermissionChange(user: any, permission: string, event: any): void {
    user.permissions[permission] = event.checked;
    user.permissions.read = true; // Always true
    this.isUpdating = true; // Disable the button when changing permissions
  }

  updateAllPermissions(): void {
    const permissionsPayload = this.filteredUsers.map(user => ({
      _id: user._id,
      permissions: {
        read: user.permissions.read,
        write: user.permissions.write,
        delete: user.permissions.delete,
      },
      role: user.role // Include the role in the payload
    }));
  
    this.isUpdating = true; // Disable the button during the update

    this.userService.updateUserPermissionsBatch(permissionsPayload).subscribe(
      response => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Permissions and roles updated successfully!' });
      },
      error => {
        console.error('Error updating permissions:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update permissions.' });
      },
      () => {
        this.isUpdating = false; // Enable the button after update completes
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}

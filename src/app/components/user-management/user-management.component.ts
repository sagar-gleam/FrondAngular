import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../sevices/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loggedInUser: any; // Store logged-in user details

  roles = ['user', 'admin']; // Possible roles

  constructor(private userService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedInUser();
    this.fetchUsers();
  }

  // Get the logged-in user's information from localStorage
  getLoggedInUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.loggedInUser = JSON.parse(storedUser); // Assuming the user object is stored here after login
    }
  }

  fetchUsers(): void {
    this.userService.getUser().subscribe((data: any[]) => {
      this.users = data;
      this.filteredUsers = this.users.filter(user => user._id !== this.loggedInUser._id);
      this.filteredUsers.forEach(user => {
        // Ensure read is always true; load existing permissions for write and delete
        user.permissions = {
          read: true, // Always true
          write: user.permissions?.write || false, // Load existing write permission
          delete: user.permissions?.delete || false // Load existing delete permission
        };
      });
    });
  }

  onRoleChange(user: any, event: any): void {
    const newRole = event.value; // Get the selected role from the dropdown

    if (newRole === 'admin') {
      this.makeAdmin(user);
    } else {
      this.removeAdmin(user);
    }
  }

  makeAdmin(user: any): void {
    this.userService.promoteToAdmin(user._id).subscribe(() => {
      user.role = 'admin'; // Update user role locally
      user.permissions = { read: false, write: false, delete: false }; // No permissions for admins
    });
  }

  removeAdmin(user: any): void {
    this.userService.removeAdmin(user._id).subscribe(() => {
      user.role = 'user'; // Update user role locally
      user.permissions = { read: true, write: false, delete: false }; // Default permissions for users
    });
  }
  onPermissionChange(user: any, permission: string, event: any): void {
    const isChecked = event.checked; 

    switch (permission) {
      case 'write':
        user.permissions.write = isChecked;
        if (isChecked) {
          this.grantWritePermission(user);
        } else {
          this.revokeWritePermission(user);
        }
        break;
  
      case 'delete':
        user.permissions.delete = isChecked;
        if (isChecked) {
          this.grantDeletePermission(user);
        } else {
          this.revokeDeletePermission(user);
        }
        break;
    }
    user.permissions.read = true;
  
  }

  grantReadPermission(user: any): void {
    this.userService.grantReadPermission(user._id).subscribe(
      response => {
        user.permissions.read = true;  // Update user role locally
        console.log('Read permission granted:', response);
      },
      error => {
        console.error('Error granting read permission:', error);
      }
    );
  }



  revokeReadPermission(user: any) {
    const userId = user.id; // Assuming user has an id property
    this.userService.revokeReadPermission(user._id).subscribe(
      response => {
        user.permissions.read = false;  // Update user role locally
        console.log('Read permission granted:', response);
      },
      error => {
        console.error('Error granting read permission:', error);
      }
    );
  }

  grantWritePermission(user: any): void {
    this.userService.grantWritePermission(user._id).subscribe(
      response => {
        user.permissions.write = true;  // Update user role locally
        console.log('write permission granted:', response);
      },
      error => {
        console.error('Error granting read permission:', error);
      }
    );
  }

  revokeWritePermission(user: any) {
    const userId = user.id; // Assuming user has an id property
    this.userService.revokeWritePermission(user._id).subscribe(
      response => {
        user.permissions.write = false;  // Update user role locally
        console.log('write permission granted:', response);
      },
      error => {
        console.error('Error granting read permission:', error);
      }
    );
  }

  grantDeletePermission(user: any): void {
    this.userService.grantDeletePermission(user._id).subscribe(
      response => {
        user.permissions.delete = true;  // Update user role locally
        console.log('Read permission granted:', response);
      },
      error => {
        console.error('Error granting read permission:', error);
      }
    );
  }

  revokeDeletePermission(user: any){
    const userId = user.id; // Assuming user has an id property
    this.userService.revokeDeletePermission(user._id).subscribe(
      response => {
        user.permissions.delete = false;  // Update user role locally
        console.log('write permission granted:', response);
      },
      error => {
        console.error('Error granting read permission:', error);
      }
    );
  }

  

  goBack(): void {
    this.router.navigate(['/home']);
  }
}

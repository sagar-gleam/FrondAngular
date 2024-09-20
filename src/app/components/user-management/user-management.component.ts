import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'] // Fixed spelling from `styleUrl` to `styleUrls`
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
 
  constructor(private userService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
   
  }

  grantReadPermission(user: any): void {
    console.log(`Grant read permission to ${user.email}`);
  }
  
  grantWritePermission(user: any): void {
    console.log(`Grant write permission to ${user.email}`);
  }
  
  goBack(): void {
    this.router.navigate(['/home']);
  }
}

import { Component, OnInit } from '@angular/core';
import { RegistrationService } from '../../registration.service';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
user: any = {}

constructor(private Signupuser: AuthenticationService, private router: Router){}

onBack(){
  this.router.navigate(['/home'])
}
ngOnInit(): void {
  // Retrieve and parse user object from local storage
  const userJson = localStorage.getItem('user');
  console.log(userJson);
  
  
  if (userJson) {
    try {
      const userObject = JSON.parse(userJson);
      const email = userObject.email;
      console.log(email,"adfdkjnzdlkvn")

      if (email) {
        // Fetch user data from the service
        this.Signupuser.getUser().subscribe(data => {
          console.log(data,"nkjdfnldnn");
          
          // Assuming the data is an array of users and each user has an 'email' property
          const matchedUser = data.find((user: any) => user.email === email);
          console.log(matchedUser)

          if (matchedUser) {
            this.user = matchedUser;
          } else {
            console.error('No user found with the provided email.');
          }
        });
      } else {
        console.error('No email found in the user object.');
      }
    } catch (error) {
      console.error('Failed to parse user data from local storage:', error);
    }
  } else {
    console.error('No user data found in local storage.');
  }
}
}

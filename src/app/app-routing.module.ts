import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent }, // Registration route
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'user-profile', component: UserProfileComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'user-management', component: UserManagementComponent },
  { path: '**', redirectTo: '' } // Wildcard route for 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

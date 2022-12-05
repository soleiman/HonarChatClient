import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [
    AuthService
  ]
})
export class SignupComponent implements OnInit {
  form: any = {
    mobile_number: '',
    full_name: '',
    password: '',
    profile_image: 'assets/img/avatars/user_profile.svg'
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,
    private storageService: StorageService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { mobile_number, full_name, password, profile_image } = this.form;

    this.authService.register(mobile_number, full_name, password, profile_image).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;

        this.form.mobile_number = '';
        this.form.full_name = '';
        this.form.password = '';

        this.storageService.saveUser(data).subscribe(res => {
          this.storageService.userSaved$.next(true);
          this.router.navigateByUrl('/home');
        });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}

import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
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
  ],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
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
  isRegistering = false;
  faExclamationTriangle = faExclamation;

  constructor(private authService: AuthService,
    private storageService: StorageService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    debugger;
    this.isRegistering = true;
    const { mobile_number, full_name, password, profile_image } = this.form;

    this.authService.register(mobile_number, full_name, password, profile_image).subscribe({
      next: data => {
        debugger;
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.isRegistering = false;
        this.form.mobile_number = '';
        this.form.full_name = '';
        this.form.password = '';

        this.storageService.saveUser(data).subscribe(res => {
          debugger;
          this.storageService.userSaved$.next(true);
          setTimeout(() => {
            this.router.navigateByUrl('/home');
          }, 5000);
        });
      },
      error: err => {
        debugger;
        this.isRegistering = false;
        console.log(err);
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    });
  }
}

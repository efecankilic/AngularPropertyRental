import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.signUpForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    const { firstName, lastName, email, password } = this.signUpForm.value;

    this.http
      .post<any>('http://localhost:8889/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      }, {withCredentials: true})
      .subscribe(
        (response) => {
          // Assuming the sign-up is successful, navigate to the homepage
          this.router.navigate(['/']);
        },
        (error) => {
          // Handle sign-up error here, show error message
          console.error('Error:', error);

          if (error && error.error && error.error.message) {
            // Display the error message from the server
            this.snackBar.open(error.error.message, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          } else {
            // Display a generic error message
            this.snackBar.open(
              'Error during registration. Please try again later.',
              'Close',
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              }
            );
          }
        }
      );
  }
}

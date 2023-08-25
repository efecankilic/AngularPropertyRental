import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.signInForm.invalid) {
      return; // Form is not valid, do not proceed with submission
    }

    const { email, password } = this.signInForm.value;

    this.http
      .post<any>('http://localhost:8889/api/auth/login', { email, password }, {withCredentials: true})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error:', error);
          let errorMessage = 'An error occurred. Please try again.';
          if (error.status === 401) {
            errorMessage = 'Incorrect email or password. Please try again.';
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          return throwError(errorMessage);
        })
      )
      .subscribe((response) => {
        console.log('Login successful');
        this.router.navigate(['/home']);
      });
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}

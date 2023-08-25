// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signIn(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8889/api/auth/login', {
      email,
      password,
    });
  }

  signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<any> {
    return this.http.post<any>('http://localhost:8889/api/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
  }
}

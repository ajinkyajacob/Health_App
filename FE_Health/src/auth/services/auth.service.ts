import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  constructor(private http: HttpClient) {}

  onLogin(user: any):Observable<any> {
    console.log("user details coming",user);
    return this.http.post("https://be-health.vercel.app/login", user)
  }

  onSignUp(newUser: {username: string, email: string, password: string}):Observable<any> {
    console.log(newUser);
    return this.http.post("https://be-health.vercel.app/register", newUser)
  }

}

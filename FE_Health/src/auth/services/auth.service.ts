import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  constructor(private http: HttpClient) {}

  OnLogin(user: any):Observable<any> {
    console.log("user details coming",user);
    return this.http.post("https://api.freeapi.app/api/v1/users/login", user)
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  constructor(private auth:AuthService, private fb:FormBuilder){}
  myForm = this.fb.group({
    email:['', Validators.required],
    password: ['', Validators.required]
  })
 
  login() {
    console.log(this.myForm);
    console.log(this.myForm.value.email);
    if(this.myForm.value.email === '' || this.myForm.value.password === '') {
      alert("User is required !!");
      return
    }

    this.auth.onLogin(this.myForm.value).subscribe(
      (data) => {        
        console.log(data);
        alert("Success")
      },
      (error) => {
        console.log(error);
        alert("Error");
      }
    )

  } 

 


}

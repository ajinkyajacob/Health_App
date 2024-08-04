import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    username:['', Validators.required],
    password: ['', Validators.required]
  })
 
  login() {
    console.log(this.myForm);
    console.log(this.myForm.value.username);
    if(this.myForm.value.username === '' || this.myForm.value.password === '') {
      alert("User is required !!");
      return
    }

    this.auth.OnLogin(this.myForm).subscribe(
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

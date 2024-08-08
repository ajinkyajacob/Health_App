import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  EmailValidator,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  constructor(private auth: AuthService, private fb: FormBuilder) {}

  regForm = this.fb.group(
    {
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  signUp() {
    //  debugger
    if (this.regForm.valid) {
      this.auth.onSignUp();    }
    return;
  }

}

function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const pwd = control.get('password')?.value;
  const confirm_pwd = control.get('confirm_password')?.value;
  pwd === confirm_pwd
    ? control.get('confirm_password')?.setErrors(null)
    : control.get('confirm_password')?.setErrors({ passwordNotMatch: true });
  return null;
}

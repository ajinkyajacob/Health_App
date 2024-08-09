import { Routes } from '@angular/router';
import { RegistrationComponent } from '../auth/component/registration/registration.component';
import { LoginComponent } from '../auth/component/login/login.component';

export const routes: Routes = [
    {
        path: '', redirectTo: '/registration', pathMatch: 'full'
    },
    { path: 'registration', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
   
];

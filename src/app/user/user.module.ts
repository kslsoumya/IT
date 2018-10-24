import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path:'login',component:LoginComponent},
      {path:'forgotPwd',component:ForgotPwdComponent},
      {path:'resetPwd/:userId',component:ResetPwdComponent}
    ])


  ],
  declarations: [LoginComponent, RegisterComponent, ForgotPwdComponent, ResetPwdComponent]
})
export class UserModule { }

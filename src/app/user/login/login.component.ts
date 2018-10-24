import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
// import { SocketService } from '../../socket.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl } from '@angular/forms';
import { SocketService } from 'src/app/socket.service';

import {
  AuthService,
  SocialUser,
  FacebookLoginProvider,
  GoogleLoginProvider,
  LinkedinLoginProvider
} from 'angular-6-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public hide = true;
  userName: any;
  password: any;
  loginForm: FormGroup;
  user: SocialUser

  constructor(private httpService: HttpService, private toastr: ToastrService, private _router: Router,
    private cookie: CookieService, private spinner: NgxSpinnerService, private socket: SocketService,
    private socialAuthService: AuthService) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      userName: new FormControl(''),
      password: new FormControl('')

    })
  }

  public loginUser = () => {
    this.spinner.show();
    const userData = {
      userName: this.loginForm.get('userName').value,
      password: this.loginForm.get('password').value
    };
    this.userSignIn(userData);
  }


  public userSignIn = (userData) => {
    this.httpService.signIn(userData).subscribe(
      (resp) => {
        // console.log(resp+'response-----------')
        if (resp.status === 200) {
          this.spinner.hide();
          this.toastr.success(resp.message);
          this.cookie.set('authToken', resp.data.authToken);
          this.cookie.set('userId', resp.data.userDetails.userId);
          this.cookie.set('userName', resp.data.userDetails.userName);
          this.socket.setUser(this.cookie.get('authToken'));
          this.cookie.set('userName', resp.data.userDetails.userName);
          this._router.navigate(['/dashboard/' + resp.data.userDetails.userId]);
        } else if (resp['status'] === 500) {
          this._router.navigate(['/error']);
        } else {
          this.toastr.warning(resp.data.message);
        }
      },
      (err) => {
        this.toastr.error(err.error.data.message);
        this._router.navigate(['/error']);
      });

  }



  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "linkedin") {
      socialPlatformProvider = LinkedinLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        const newUser = {
          emailId: userData.email,
          userName: userData.name,
          password: userData.name,
          mobile :567,
          dob : '11-11-0090'
        };
        console.log(socialPlatform + " sign in data : ", userData);
        // Now sign-in with userData
        // ...
        this.httpService.findUser(userData.name).subscribe(
          (resp) => {
            if (resp['status'] === 200) {
              this.userSignIn(newUser);
            } else {
              
              this.httpService.register(newUser).subscribe(
                (response) => {
                  if (response['status'] === 200) {
                    this.userSignIn(newUser);
                  } else {
                    this.toastr.info(response.message)

                  }
                },
                (err) => {
                  this._router.navigate(['/error']);
                })

            }
          },
          (err) => {
            this._router.navigate(['/error']);
          }
        )
      })
  }

}

import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent implements OnInit {
  isSent: boolean;
  email: any;
  pwd: any;
  resetPwdForm : FormGroup

  constructor(private httpService: HttpService, private toastr: ToastrService, private _router: Router,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.resetPwdForm = new FormGroup({
      userName: new FormControl('')
    })
  }


  public forgotPwd = () => {
    this.spinner.show();
      const userName = this.resetPwdForm.get('userName').value
    this.httpService.sendResetLink(userName).subscribe(
      (resp) => {
        if (resp['status'] === 200) {
          this.spinner.hide();
          // this.isSent = true;
          this._router.navigate(['/login']);
        } else {
          this.toastr.warning(resp['message']);
        }
      },
      (err) => {
        this.toastr.error(err);
        this._router.navigate(['/error']);
      });
  }

}

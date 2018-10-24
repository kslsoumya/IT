import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.css']
})
export class ResetPwdComponent implements OnInit {

  newPwdForm : FormGroup
  public hide = true;


  constructor(private _router: Router, private route: ActivatedRoute,private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private httpService: HttpService) { }

  ngOnInit() {

    this.newPwdForm = new FormGroup({
      userName: new FormControl(this.route.snapshot.queryParamMap.get('userName')),
      password: new FormControl('')
  
    })

    
    // console.log(this.route.snapshot.paramMap.get('userId'));
  }


  public resetPassword =() =>{
    // this.spinner.show();
    const data ={
      userId : this.route.snapshot.paramMap.get('userId'),
      password : this.newPwdForm.get('password').value
    }
    this.httpService.pwdService(data).subscribe(
      (resp)=> {
        if(resp['status']===200) {
          this._router.navigate(['/login']);
          this.toastr.success('Password reset successful');
        } else {
          this.toastr.warning('Try Again');
        }
      },
      (err)=>{
        console.log(err);
        this._router.navigate(['/error']);
      }
    )
  }

}

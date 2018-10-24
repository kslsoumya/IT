import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpService } from 'src/app/http.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
// import { SocketService } from 'src/app/socket.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('notifyModal') notifyModal: TemplateRef<any>;

  public hide = true;
  public emailId;
  public userName;
  public password;
  public dob;
  public mobile;
  public registerResponse;
  signUpForm: FormGroup;

  constructor(private httpService: HttpService , private toastr: ToastrService, private _router: Router,
    private spinner: NgxSpinnerService, private modal: NgbModal) { }

  ngOnInit() {

    
  this.signUpForm = new FormGroup({
    emailId: new FormControl(''),
    userName: new FormControl(''),
    password: new FormControl('',Validators.minLength(4)),
    dob : new FormControl(''),
    mobile : new FormControl('',Validators.minLength(10))

  });
  }

  public registerUser =() =>{
    this.spinner.show();
    const newUser = {
      emailId : this.signUpForm.get('emailId').value,
      userName : this.signUpForm.get('userName').value,
      password : this.signUpForm.get('password').value,
      dob : this.signUpForm.get('dob').value,
      mobile : this.signUpForm.get('mobile').value

    };
    console.log(newUser);
    this.httpService.register(newUser).subscribe(
      (response) => {
        this.registerResponse =response;
        // console.log(response);
        if (response['status'] === 200) {
        this.spinner.hide();
        this.toastr.success('User Created successfully!!');
        // this.socketService.newUser(response.data);
        setTimeout(() => {
          this._router.navigate(['/login']);
        });
        } else if (response['status'] === 500) {
          this.spinner.hide();
          this._router.navigate(['/error']);
        } else {
          this.spinner.hide();
        // this.toastr.warning(response.message);
        this.modal.open(this.notifyModal, { size: 'lg' });
        this.signUpForm.reset();
        }

      },
      (err) =>{
        console.log(err);
        this._router.navigate(['/error']);
      }
    )
  }
}

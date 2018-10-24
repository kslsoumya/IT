import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SocketService } from 'src/app/socket.service';

@Component({
  selector: 'app-issue-desc',
  templateUrl: './issue-desc.component.html',
  styleUrls: ['./issue-desc.component.css']
})
export class IssueDescComponent implements OnInit {
  @ViewChild('watcherModal') watcherModal: TemplateRef<any>;
  @ViewChild('notifyModal') notifyModal: TemplateRef<any>;


  public userId;
  public userList;
  public issueId;
  public title;
  public assignee;
  public description;
  public notification;
  public comments;
  public issueStatus = 'New';
  public isView = false;
  public isCreate = true;
  public isEdit = false;
  public userName;
  public isWatch = true;
  public isUnWatch = false;
  public watchers = [];
  public isValueChanged = false;
  public checkboxValues = [{ title: 'New', checked: true },
  { title: 'In Progress', checked: false }, { title: 'In Test', checked: false }, { title: 'Done', checked: false },
  { title: 'Backlog', checked: false }];

  public options: Object = {
    events: {
      'froalaEditor.initialized': function (e, editor) {
        editor.edit.off();
      }
    }
  }

  constructor(private _router: Router, private route: ActivatedRoute, private toastr: ToastrService, private spinner: NgxSpinnerService,
    private httpService: HttpService, private cookie: CookieService, private socket: SocketService,
    private modal: NgbModal) { }

  ngOnInit() {

    this.userId = this.route.snapshot.paramMap.get('userId');
    this.issueId = this.route.snapshot.paramMap.get('issue');
    this.userName = this.cookie.get('userName');
    this.getUsersList();
    if (this.issueId !== undefined && this.issueId !== null) {
      this.isView = true;
      this.isCreate = false;
      this.getIssueDetails();
    }
    else {
      this.isCreate = true;
      this.isView = false;
    }
  }


  public getIssueDetails = () => {
    this.httpService.getIssueDetail(this.issueId).subscribe(
      (response) => {
        if (response['status'] === 200) {
          this.title = response['data'].title;
          this.assignee = response['data'].assignee;
          this.description = response['data'].description;
          this.comments = response['data'].comments;
          this.updateSelection(response['data'].status);
          if (response['data'].watchers.findIndex((val) => { return val.id === this.userId }) !== -1) {
            this.isUnWatch = true;
            this.isWatch = false;
          }
          response['data'].watchers.forEach((val) => {
            if (val.id !== this.userId) {
              this.watchers.push(val.name)
            }
            console.log(this.watchers)
          })
        }
      })
  }



  public getUsersList = () => {
    this.httpService.getAllUsers(this.userId).subscribe(
      (response) => {
        if(response['status']=== 200) {
        this.userList = response['data'];
      } else if (response['status']=== 404) {
        this.toastr.warning(response['message']);
        if(response['message'] ==='Invalid Or Expired Authentication Key') {
          this._router.navigate(['/login']);
        }
      }
    })
  }

  public openIssue = (id) => {
    this.issueId = id;
    this.getIssueDetails();
  }

  public createIssue = () => {
    this.spinner.show();
    this.isCreate = true;
    this.isView = false;
    this.isEdit = false;
    const newIssue = {
      title: this.title,
      desc: this.description,
      comments: this.comments,
      status: this.issueStatus,
      assignee: this.assignee,
      reporterId: this.userId,
      reporterName: this.userName
    }
    this.httpService.createIssue(newIssue).subscribe(
      response => {
        this.spinner.hide();
        if (response['status'] === 200) {
          this.toastr.success('Issue Created')
          this._router.navigate(['/dashboard/' + this.userId]);
        } else if (response['status']=== 404) {
          this.toastr.warning(response['message']);
          if(response['message'] ==='Invalid Or Expired Authentication Key') {
            this._router.navigate(['/login']);
          }
        }
      },
      (err) => {
        console.log(err);
        this._router.navigate(['/error']);
      }
    )

  }

  public editIssue = () => {
    this.isCreate = true;
    this.isView = false;
    this.isEdit = true;
    if (this.isValueChanged) {
      const editedIssue = {
        title: this.title,
        description: this.description,
        comments: this.comments,
        status: this.issueStatus,
        assignee: this.assignee,
        reporterId: this.userId,
        repName: this.userName
      }
      this.httpService.updateIssue(editedIssue, this.issueId).subscribe(
        response => {
          if (response['status'] === 200) {
            this.socket.changeIssue(this.issueId)
            this._router.navigate(['/dashboard/' + this.userId]);
          } else if (response['status']=== 404) {
            this.toastr.warning(response['message']);
            if(response['message'] ==='Invalid Or Expired Authentication Key') {
              this._router.navigate(['/login']);
            }
          }
        },
        (err) => {
          console.log(err);
          this._router.navigate(['/error']);
        }
      )
    }
  }
  public cancelCreate = () => {
    this._router.navigate(['/dashboard/' + this.userId])
  }
  public updateSelection = (selected) => {
    this.issueStatus = selected;
    this.checkboxValues.forEach(value => {
      if (value.title === selected) {
        value.checked = true
      } else {
        value.checked = false;
      }
    })
  }
  public deleteIssue = () => {
    this.httpService.deleteIssue(this.issueId).subscribe(
      response => {
        if (response['status'] === 200) {
          this.toastr.success('Deleted Successfully');
          this._router.navigate(['/dashboard/' + this.userId]);
        } else if (response['status']=== 404) {
          this.toastr.warning(response['message']);
          if(response['message'] ==='Invalid Or Expired Authentication Key') {
            this._router.navigate(['/login']);
          }
        }
        (err) => {
          console.log(err);
          this._router.navigate(['/error']);
        }
      })
  }

  public cancelEdit = () => {
    this.isCreate = false;
    this.isView = true;
    this.isEdit = false;
  }

  public watchIssue = () => {
    this.isUnWatch = true;
    this.isWatch = false;
    const obj = {
      userId: this.userId,
      userName: this.userName
    }
    this.httpService.watchIssue(this.issueId, obj).subscribe(
      response => {
        if (response['status'] === 200) {
          this.toastr.success('Watching');
          this.socket.watchEvent(this.issueId)
        } else if (response['status']=== 404) {
          this.toastr.warning(response['message']);
          if(response['message'] ==='Invalid Or Expired Authentication Key') {
            this._router.navigate(['/login']);
          }
        }
        (err) => {
          console.log(err);
          this._router.navigate(['/error']);
        }
      })
  }


  public unWatchIssue = () => {
    this.isWatch = true;
    this.isUnWatch = false;
    this.httpService.unWatchIssue(this.issueId, this.userId).subscribe(
      response => {
        if (response['status'] === 200) {
          this.toastr.warning('Not watching');
          this.socket.unWatchEvent(this.issueId);
        } else if (response['status']=== 404) {
          this.toastr.warning(response['message']);
          if(response['message'] ==='Invalid Or Expired Authentication Key') {
            this._router.navigate(['/login']);
          }
        }
        (err) => {
          console.log(err);
          this._router.navigate(['/error']);
        }
      })
  }

  public getWatchers = () => {
    this.modal.open(this.watcherModal, { size: 'sm' })
  }

  public listenNotification = () => {
    this.socket.notification().subscribe(
      (data) => {
        console.log(data);
        this.notification = data;
        this.modal.open(this.notifyModal, { size: 'sm' });
      });
  }




}

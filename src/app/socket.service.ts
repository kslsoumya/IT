import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

// public baseUrl = 'http://localhost:3000';
public baseUrl = 'http://issuetracker-api.themeanstackpro.com';

private socket;

constructor(public _http: HttpClient, private cookieService: CookieService) {
  this.socket = io(this.baseUrl);
}


// // Events to be listened----




public disConnect = (): any => {
  return Observable.create((observer) => {
    this.socket.on('disconnect', () => {
      observer.next();

    });
  });
}



public notification = (): any => {
  return Observable.create((observer) => {
    this.socket.on('issueUpdate', (data) => {
      observer.next(data);
    });
  });
}

// public meetingUpdate = (): any => {
//   return Observable.create((observer) => {
//     this.socket.on('meetingChanged', (data) => {
//       observer.next(data);
//     });
//   });
// }

// public meetingCancel = (): any => {
//   return Observable.create((observer) => {
//     this.socket.on('meetingCancelled', (data) => {
//       observer.next(data);
//     });
//   });
// }


// // events to be emitted---------
public setUser: any = (authToken) => {
  this.socket.emit('set-user', authToken);
}

public changeIssue: any = (issueId) => {
  this.socket.emit('modifyIssue', issueId);
}
public watchEvent: any = (issueId) => {
  this.socket.emit('watchIssue', issueId);
}
public unWatchEvent: any = (issueId) => {
  this.socket.emit('unWatchIssue', issueId);
}

public exitSocket: any = () => {
  this.socket.disconnect();
}



private handleError(err: HttpErrorResponse) {
  let errorMessage = '';
  if (err.error instanceof Error) {
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
  } // end condition *if
  console.error(errorMessage);
  return Observable.throw(errorMessage);

}


}

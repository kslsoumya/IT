import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // public baseUrl = 'http://localhost:3000';
  public baseUrl = 'http://issuetracker-api.themeanstackpro.com';

  constructor(public _http: HttpClient, public cookieService: CookieService) { }

  public register(data): Observable<any> {
    const params = new HttpParams()
      .set('userName', data.userName)
      .set('email', data.emailId)
      .set('mobile', data.mobile)
      .set('dob', data.dob)
      .set('password', data.password);
    return (this._http.post(`${this.baseUrl}/api/v1/users/register`, params));
  }

  public signIn(data): Observable<any> {
    const params = new HttpParams()
      .set('userName', data.userName)
      .set('password', data.password);
    return (this._http.post(`${this.baseUrl}/api/v1/users/login`, params));
  }

  public sendResetLink = (userName) => {
    return this._http.get(`${this.baseUrl}/api/v1/users/send/resetLink/${userName}`);
  }


  public pwdService = (data) => {
    return this._http.put(`${this.baseUrl}/api/v1/users/forgotPwd`, data);
  }

  public getAllUsers = (id) => {
    return this._http.get(`${this.baseUrl}/api/v1/users/get/all?authToken=${this.cookieService.get('authToken')}&id=${id}`);
  }

  public findUser = (userName) => {
    return this._http.get(`${this.baseUrl}/api/v1/users/findUser/${userName}`);
  }

  public getAllIssues(userName) {
    return this._http.get(`${this.baseUrl}/api/v1/issues/get/all/${userName}?authToken=${this.cookieService.get('authToken')}`);

  }

  public searchIssues(searchText) {
    return this._http.get(`${this.baseUrl}/api/v1/issues/search/${searchText}?authToken=${this.cookieService.get('authToken')}`);

  }
  public createIssue = (issue) => {
    issue.authToken = this.cookieService.get('authToken');
    return this._http.post(`${this.baseUrl}/api/v1/issues/create`, issue);
  }

  public getIssueDetail = (id) => {
    return this._http.get(`${this.baseUrl}/api/v1/issues/detail/${id}?authToken=${this.cookieService.get('authToken')}`);

  }
  public updateIssue = (issue,id) => {
    issue.authToken = this.cookieService.get('authToken');
    return this._http.put(`${this.baseUrl}/api/v1/issues/update/${id}`, issue);
  }
  public deleteIssue = (id) => {
    const obj = {authToken: this.cookieService.get('authToken') };
    return this._http.post(`${this.baseUrl}/api/v1/issues/delete/${id}`, obj);
  }

  public watchIssue = (id,obj) => {
     obj.authToken = this.cookieService.get('authToken');
    return this._http.post(`${this.baseUrl}/api/v1/issues/watch/${id}`, obj);
  }

  public unWatchIssue = (issueId,userId) => {
   return this._http.get(`${this.baseUrl}/api/v1/issues/unWatch/${issueId}/${userId}?authToken=${this.cookieService.get('authToken')}`);
 }

 public getWatchers = (issueId,userId) => {
  return this._http.get(`${this.baseUrl}/api/v1/issues/unWatch/${issueId}/${userId}?authToken=${this.cookieService.get('authToken')}`);
}

  public logOutFunction(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', this.cookieService.get('authToken'));
    return (this._http.post(`${this.baseUrl}/api/v1/users/logout`, params));
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

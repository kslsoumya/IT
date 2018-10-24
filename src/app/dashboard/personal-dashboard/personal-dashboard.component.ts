import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from 'src/app/http.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-personal-dashboard',
  templateUrl: './personal-dashboard.component.html',
  styleUrls: ['./personal-dashboard.component.css']
})
export class PersonalDashboardComponent implements OnInit {

  @ViewChild('notifyModal') notifyModal: TemplateRef<any>;

  public userId;
  public userName;
  public searchText;
  public isChanged = false;
  public notification;

  public rows:Array<any> = [];
  public columns:Array<any> = [
    {title: 'Id', name: 'issueId'},
    {
      title: 'Title',
      name: 'title',
      sort: true,
      filtering: {filterString: '', placeholder: 'Filter by Title'}
    },
    {title: 'Reporter', className: ['office-header', 'text-success'], name: 'repName', sort: 'asc',
    filtering: {filterString: '', placeholder: 'Filter by Reporter'}},
    {title: 'Status', name: 'status', sort: '', filtering: {filterString: '', placeholder: 'Filter by status'}},
    {title: 'Date', className: 'text-warning', name: 'createdOn'}
  ];
  public page:number = 1;
  public itemsPerPage:number = 5;
  public maxSize:number = 5;
  public numPages:number = 1;
  public length:number = 0;



  public config:any = {
    paging: true,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-bordered','table-responsive-md']
  };

  public data:Array<any> = [];

  constructor(private _router: Router, private route: ActivatedRoute,private cookie: CookieService,
    private httpService: HttpService,private toastr: ToastrService,private socket :SocketService,
    private modal: NgbModal) {
    // this.length = this.data.length;
    

   }

  ngOnInit() {
    this.userName = this.cookie.get('userName');
    this.userId = this.cookie.get('userId');
    this.httpService.getAllIssues(this.userName).subscribe(
      response =>{
        if(response['status'] === 200 ){
        this.data = response['data'];
        this.length = this.data.length;
        // this.userId = this.cookie.get('userId');
        this.onChangeTable(this.config,true);
        } else if (response['status']=== 404) {
          this.toastr.warning(response['message']);
          if(response['message'] ==='Invalid Or Expired Authentication Key') {
            this._router.navigate(['/login']);
          }
        }
      },
      (err)=>{
        this._router.navigate(['/error']);
      }
    )
    this.listenNotification();
  }

  public changePage(page:any, data:Array<any> = this.data):Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  public changeSort(data:any, config:any):any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName:string = void 0;
    let sort:string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous:any, current:any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  public changeFilter(data:any, config:any):any {
    let filteredData:Array<any> = data;
    this.columns.forEach((column:any) => {
      // console.log(column.filtering)
      if (column.filtering && column.filtering.filterString) {
        filteredData = filteredData.filter((item:any) => {
          return item[column.name].match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item:any) =>
        item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray:Array<any> = [];
    filteredData.forEach((item:any) => {
      let flag = false;
      this.columns.forEach((column:any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any): any {
    // console.log(data);
    
    this._router.navigate(['/issue/'+this.userId,{issue :data.row.issueId}]);
  }

  public openIssue = (issueId) =>{
    this._router.navigate(['/issue/'+this.userId,{issue :issueId}]);

  }


  public searchAnIssue =() =>{
    if(this.searchText){
    this.httpService.searchIssues(this.searchText).subscribe(
      (response)=>{
        // console.log(response+'---------');
        if(response['status']=== 200) {
          this.data = response['data'];
          this.length = this.data.length;
          this.onChangeTable(this.config,true);       
         } else if (response['status']=== 404) {
          this.toastr.warning(response['message']);
          if(response['message'] ==='Invalid Or Expired Authentication Key') {
            this._router.navigate(['/login']);
          }
        }
      },
      (err) =>{
        this._router.navigate(['/error']);
      })
    }
  }


  public listenNotification = () => {
    this.socket.notification().subscribe(
      (data) => {
        console.log(data);
        this.notification = data;
        this.modal.open(this.notifyModal, { size: 'sm' });
      });
  }

  public createIssue =() =>{
     this.userId = this.route.snapshot.paramMap.get('userId');
    this._router.navigate(['/issue/'+this.userId])
  }


  public logOut: any = () => {
    this.httpService.logOutFunction()
      .subscribe(resp => {
        if (resp.status === 200) {
          this.cookie.deleteAll();
          this.socket.exitSocket();
          this._router.navigate(['/']);
        } else {
          this.toastr.error(resp.message);
        }
      },
        (err) => {
          console.log(err);
          this._router.navigate(['/error']);
        });
  }
}



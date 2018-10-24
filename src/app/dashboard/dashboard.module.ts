import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDashboardComponent } from './personal-dashboard/personal-dashboard.component';
import { IssueDescComponent } from './issue-desc/issue-desc.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

import { Ng2TableModule } from 'ng2-table/ng2-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxSpinnerModule } from 'ngx-spinner';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2TableModule,
    NgxSpinnerModule,
    PaginationModule.forRoot(),
    ToastrModule.forRoot(),
    FroalaEditorModule.forRoot(),
    RouterModule.forChild([
      {path:'dashboard/:userId',component:PersonalDashboardComponent},
      {path:'issue/:userId',component:IssueDescComponent}
    ])
  ],
  declarations: [PersonalDashboardComponent, IssueDescComponent]
})
export class DashboardModule { }

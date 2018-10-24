import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDescComponent } from './issue-desc.component';

describe('IssueDescComponent', () => {
  let component: IssueDescComponent;
  let fixture: ComponentFixture<IssueDescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueDescComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

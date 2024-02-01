import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service';

@Component({
  selector: 'app-admin-user-selection-unrouted',
  templateUrl: './admin-user-selection-unrouted.component.html',
  styleUrls: ['./admin-user-selection-unrouted.component.css']
})
export class AdminUserSelectionUnroutedComponent implements OnInit {

  page: IUserPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0};
  status: HttpErrorResponse | null = null;
  usuarioABorrar: IUser | null = null;

  constructor(
    private userAjaxService: UserAjaxService,
    public dialogService: DialogService,
    public dynamicDialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    const page = this.paginatorState.page || 0;
    const rows = this.paginatorState.rows || 0;
    this.userAjaxService.getUserPage(rows, page, this.orderField, this.orderDirection).subscribe({
      next: (data: IUserPage) => {
        this.page = data;
        this.paginatorState.pageCount = data.totalPages;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }

  onSelectUser(user: IUser) {
    this.dynamicDialogRef.close(user);
  }


}
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { ICategory, ICategoryPage } from 'src/app/model/model.interfaces';
import { CategoryAjaxService } from 'src/app/service/category.ajax.service';

@Component({
  selector: 'app-admin-category-selection-unrouted',
  templateUrl: './admin-category-selection-unrouted.component.html',
  styleUrls: ['./admin-category-selection-unrouted.component.css']
})
export class AdminCategorySelectionUnroutedComponent implements OnInit {

  page: ICategoryPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;

  constructor(
    private categoryAjaxService: CategoryAjaxService,
    public dialogService: DialogService,
    public dynamicDialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    const page = this.paginatorState.page || 0;
    const rows = this.paginatorState.rows || 0;
    this.categoryAjaxService.getCategoryPage(page, rows, this.orderField, this.orderDirection).subscribe({
      next: (data: ICategoryPage) => {
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

  onSelectCategory(category: ICategory) {
    this.dynamicDialogRef.close(category);
  }

}
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { ICategory, ICategoryPage } from 'src/app/model/model.interfaces';
import { CategoryAjaxService } from 'src/app/service/category.ajax.service';
import { AdminCategoryDetailUnroutedComponent } from '../admin-category-detail-unrouted/admin-category-detail-unrouted.component';

@Component({
  providers: [DialogService, ConfirmationService],
  selector: 'app-admin-category-plist-unrouted',
  templateUrl: './admin-category-plist-unrouted.component.html',
  styleUrls: ['./admin-category-plist-unrouted.component.css']
})
export class AdminCategoryPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  page: ICategoryPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  categoryToDelete: ICategory | null = null;
  categories: ICategory[] = [];

  value: string = '';

  constructor(
    private categoryAjaxService: CategoryAjaxService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    })
  }

  onInputChange(query: string): void {
    if (query.length > 2) {
      this.categoryAjaxService
        .getCategoryPage(this.paginatorState.rows, this.paginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: ICategoryPage) => {
            this.page = data;
            this.categories = data.content;
            this.paginatorState.pageCount = data.totalPages;
            console.log(this.paginatorState);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
          }
        });
    } else {
      this.getPage();
    }
  }

  getPage(): void {
    this.categoryAjaxService
      .getCategoryPage(
        this.paginatorState.rows,
        this.paginatorState.page,
        this.orderField,
        this.orderDirection
      )
      .subscribe({
        next: (data: ICategoryPage) => {
          this.page = data;
          this.paginatorState.pageCount = data.totalPages;
          this.categories = data.content;
          console.log(this.paginatorState);
          console.log(this.categories);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    this.orderDirection = this.orderDirection == "asc" ? "desc" : "asc";
    this.getPage();
  }

  doView(category: ICategory) {
    let ref: DynamicDialogRef | undefined;
    ref = this.dialogService.open(AdminCategoryDetailUnroutedComponent, { // TODO: Change this to the correct component
      width: '70%',
      maximizable: false,
      data: { id: category.id, ref }
    });
  }

  doRemove(category: ICategory) {
    this.categoryToDelete = category;
    this.confirmationService.confirm({
      accept: () => {
        this.matSnackBar.open("Se ha eliminado la categoria", 'Aceptar', { duration: 3000 });
        this.categoryAjaxService.deleteCategory(category.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
          }
        });
      },
      reject: (type: ConfirmEventType) => {
        this.matSnackBar.open("No se ha podido eliminar la categoria", 'Aceptar', { duration: 3000 });
      }
    })
  }

}
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { IProduct, IProductPage } from 'src/app/model/model.interfaces';
import { ProductAjaxService } from 'src/app/service/product.ajax.service';

@Component({
  selector: 'app-admin-product-selection-unrouted',
  templateUrl: './admin-product-selection-unrouted.component.html',
  styleUrls: ['./admin-product-selection-unrouted.component.css']
})
export class AdminProductSelectionUnroutedComponent implements OnInit {

  @Input() category_id: number = 0;

  page: IProductPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0};
  status: HttpErrorResponse | null = null;
  
  constructor(
    private productAjaxService: ProductAjaxService,
    public dialogService: DialogService,
    public dynamicDialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.getPage();
  }

  getPage(): void {
    const page = this.paginatorState.page || 0;
    const rows = this.paginatorState.rows || 0;
    this.productAjaxService.getPageProducts(rows, page, this.orderField, this.orderDirection, this.category_id ).subscribe({
      next: (data: IProductPage) => {
        this.page = data;
        this.paginatorState.pageCount = data.totalPages;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    });
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

  selectProduct(product: IProduct) {
    this.dynamicDialogRef.close(product);
  }

}

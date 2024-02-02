import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IProduct, IProductPage } from 'src/app/model/model.interfaces';
import { ProductAjaxService } from 'src/app/service/product.ajax.service';
import { AdminProductDetailUnroutedComponent } from '../admin-product-detail-unrouted/admin-product-detail-unrouted.component';

@Component({
  providers: [DialogService, ConfirmationService],
  selector: 'app-admin-product-plist-unrouted',
  templateUrl: './admin-product-plist-unrouted.component.html',
  styleUrls: ['./admin-product-plist-unrouted.component.css']
})
export class AdminProductPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  page: IProductPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0};
  status: HttpErrorResponse | null = null;
  productToDelete: IProduct | null = null;
  
  constructor(
    private productAjaxService: ProductAjaxService,
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

  getPage(): void {
    const page: number = this.paginatorState.page || 0;
    const rows: number = this.paginatorState.rows || 0;
    this.productAjaxService.getPageProducts(rows, page, this.orderField, this.orderDirection).subscribe({
      next: (page: IProductPage) => {
        this.page = page;
        this.paginatorState.pageCount = page.totalPages;
      },
      error: (response: HttpErrorResponse) => {
        this.status = response;
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
      this.orderDirection = this.orderDirection == "asc" ? "desc" : "asc";
      this.getPage();
    }

    doView(product: IProduct) {
      let ref: DynamicDialogRef | undefined;
      ref = this.dialogService.open(AdminProductDetailUnroutedComponent, {
        header: 'Detalle de usuario',
        width: '70%',
        maximizable: false,
        data: { id: product.id, ref }
        });
      }

      doRemove(product: IProduct) {
        this.productToDelete = product;
        this.confirmationService.confirm({
          accept: () => {
            this.matSnackBar.open("Se ha eliminado el usuario", 'Aceptar', { duration: 3000 });
            this.productAjaxService.deleteProduct(product.id).subscribe({
              next: () => {
                this.getPage();
              },
              error: (err: HttpErrorResponse) => {
                this.status = err;
              }
            });
          },
          reject: (type: ConfirmEventType) => {
            this.matSnackBar.open("No se ha podido eliminar el usuario", 'Aceptar', { duration: 3000 });
          }
        })
      }


    }
  
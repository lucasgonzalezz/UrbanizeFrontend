import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { ICategory, IProduct, IProductPage } from 'src/app/model/model.interfaces';
import { ProductAjaxService } from 'src/app/service/product.ajax.service';
import { AdminProductDetailUnroutedComponent } from '../admin-product-detail-unrouted/admin-product-detail-unrouted.component';
import { CategoryAjaxService } from 'src/app/service/category.ajax.service';
import Swal from 'sweetalert2';

@Component({
  providers: [DialogService, ConfirmationService],
  selector: 'app-admin-product-plist-unrouted',
  templateUrl: './admin-product-plist-unrouted.component.html',
  styleUrls: ['./admin-product-plist-unrouted.component.css']
})
export class AdminProductPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() category_id: number = 0;

  page: IProductPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  productToDelete: IProduct | null = null;
  products: IProduct[] = [];
  category: ICategory | null = null;

  value: string = '';

  constructor(
    private productAjaxService: ProductAjaxService,
    private categoryAjaxService: CategoryAjaxService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar
  ) {
    
   }

  ngOnInit() {
    this.getPage();
    if (this.category_id > 0) {
      this.getCategory();
    }
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
    this.productAjaxService.getPageProducts(rows, page, this.orderField, this.orderDirection, this.category_id).subscribe({
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
      width: '70%',
      maximizable: false,
      data: { id: product.id, ref }
    });
  }

  doRemove(product: IProduct) {
    this.productToDelete = product;
    Swal.fire({
      title: "¿Estás seguro de eliminar el producto?",
      html: `
        <div style="text-align: center;">
          <p>Nombre: <strong>${product.name}</strong></p><br>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#164e63",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.matSnackBar.open("Se ha eliminado el producto", 'Aceptar', { duration: 3000 });
        this.productAjaxService.deleteProduct(product.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (err: HttpErrorResponse) => {
            this.matSnackBar.open("No se ha podido eliminar el producto", 'Aceptar', { duration: 3000 });
          }
        });
      }
    });
  }  

  onInputChange(query: string): void {
    if (query.length > 2) {
      this.productAjaxService
        .getPageProducts(this.paginatorState.rows, this.paginatorState.page, this.orderField, this.orderDirection, this.category_id,
          query)
        .subscribe({
          next: (data: IProductPage) => {
            this.page = data;
            this.products = data.content;
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

  getCategory(): void {
    this.categoryAjaxService.getCategoryById(this.category_id).subscribe({
      next: (data: ICategory) => {
        this.category = data;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    });
  }

  getProductsByCategory(): void {
    const psPage = this.paginatorState.page || 0;
    const rows = this.paginatorState.rows || 0;
    this.productAjaxService.getProductsByCategory(this.category_id, rows, psPage, this.orderField, this.orderDirection).subscribe({
      next: (data: IProductPage) => {
        this.page = data;
        this.paginatorState.pageCount = data.totalPages;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

}


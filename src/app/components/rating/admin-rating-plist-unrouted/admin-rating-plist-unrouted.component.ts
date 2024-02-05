import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IProduct, IUser, IRating, IRatingPage } from 'src/app/model/model.interfaces';
import { ProductAjaxService } from '../../../service/product.ajax.service';
import { UserAjaxService } from '../../../service/user.ajax.service';
import { RatingAjaxService } from '../../../service/rating.ajax.service';

@Component({
  selector: 'app-admin-rating-plist-unrouted',
  templateUrl: './admin-rating-plist-unrouted.component.html',
  styleUrls: ['./admin-rating-plist-unrouted.component.css']
})
export class AdminRatingPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() user_id: number = 0;
  @Input() product_id: number = 0;

  page: IRatingPage | undefined;
  user: IUser | null = null;
  product: IProduct | null = null;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0};
  status: HttpErrorResponse | null = null;
  ratingToDelete: IRating | null = null;

  constructor(
    private userAjaxService: UserAjaxService,
    private productAjaxService: ProductAjaxService,
    private ratingAjaxService: RatingAjaxService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPage();
    if (this.user_id > 0) {
      this.getUser();
    }
    if (this.product_id > 0) {
      this.getProduct();
    }
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
        this.getPage();
      }
    }
    });
  }

  getPage(): void {
    const page: number = this.paginatorState.page ?? 0;
    const rows: number = this.paginatorState.rows ?? 0;
    this.ratingAjaxService.getRatingPage(rows, page, this.orderField, this.orderDirection, this.user_id, this.product_id).subscribe({
      next: (page: IRatingPage) => {
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

    doView(valoracion: IRating) {
      let ref: DynamicDialogRef | undefined;
      ref = this.dialogService.open(AdminRatingPlistUnroutedComponent, { // cambiar por el componente de detalle
        data: { id: valoracion.id },
        header: "Detalle de la valoracion",
        width: "70%",
        maximizable: false
      });
    }

    doRemove(valoracion: IRating) {
      this.ratingToDelete = valoracion;
      this.confirmationService.confirm({
        accept: () => {
          this.ratingAjaxService.deleteRating(valoracion.id).subscribe({
            next: () => {
              this.matSnackBar.open("Valoracion borrada", "Aceptar", { duration: 3000 });
              this.getPage();
            },
            error: (err: HttpErrorResponse) => {
              this.status = err;
              this.matSnackBar.open("Error al borrar la valoracion", "Aceptar", { duration: 3000 });
            }
          });
        },
        reject: () => {
          this.matSnackBar.open("No se ha borrado la valoracion", "Aceptar", { duration: 3000 });
        }
      });
    }

    getUser(): void {
      this.userAjaxService.getUserById(this.user_id).subscribe({
        next: (data: IUser) => {
          this.user = data;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
        }
      });
    }

    getProduct(): void {
      this.productAjaxService.getProductById(this.product_id).subscribe({
        next: (data: IProduct) => {
          this.product = data;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
        }
      })
    }

  }

  

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IProduct, IUser, IRating, IRatingPage } from 'src/app/model/model.interfaces';
import { ProductAjaxService } from './../../../service/product.ajax.service';
import { SessionAjaxService } from './../../../service/session.ajax.service';
import { RatingAjaxService } from './../../../service/rating.ajax.service';

@Component({
  selector: 'app-user-rating-plist-unrouted',
  templateUrl: './user-rating-plist-unrouted.component.html',
  styleUrls: ['./user-rating-plist-unrouted.component.css']
})
export class UserRatingPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() product_id: number = 0;

  page: IRatingPage | undefined;
  product: IProduct | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 30, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  user: IUser | null = null;

  constructor(
    private ratingAjaxService: RatingAjaxService,
    private productAjaxService: ProductAjaxService,
    private sessionAjaxService: SessionAjaxService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getRatings();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getRatings();
        }
      }
    });
    this.sessionAjaxService.getSessionUser()?.subscribe({
      next: (user: IUser) => {
        this.user = user;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

  getRatings() {
    const rows: number = this.paginatorState.rows ?? 0;
    const page: number = this.paginatorState.page ?? 0;
    this.ratingAjaxService.getRatingPageByProduct(this.product_id, page, rows, this.orderField, this.orderDirection).subscribe({
      next: (page: IRatingPage) => {
        this.page = page;
        this.paginatorState.pageCount = page.totalPages;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

  getPage(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
  }

  recargarValoraciones() {
    this.getRatings();
  }

  isUsuarioValoracion(reting: IRating): boolean {
    return this.user !== null && reting.user.id === this.user.id;
  }

  borrarValoracion(rating_id: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres borrar la valoración?',
      accept: () => {
        this.ratingAjaxService.deleteRating(rating_id).subscribe({
          next: () => {
            this.getRatings();
            this.matSnackBar.open('Valoración borrada', 'Aceptar', { duration: 3000 });
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al borrar la valoración', 'Aceptar', { duration: 3000 });
          }
        })
      }
    });

  }



}
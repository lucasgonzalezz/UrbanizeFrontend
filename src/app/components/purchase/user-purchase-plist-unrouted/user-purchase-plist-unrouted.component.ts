import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IPurchasePage, IUser } from 'src/app/model/model.interfaces';
import { PurchaseAjaxService } from '../../../service/purchase.ajax.service';
import { SessionAjaxService } from '../../../service/session.ajax.service';

@Component({
  selector: 'app-user-purchase-plist-unrouted',
  templateUrl: './user-purchase-plist-unrouted.component.html',
  styleUrls: ['./user-purchase-plist-unrouted.component.css']
})
export class UserPurchasePlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
 

  page: IPurchasePage | undefined;
  user: IUser | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0};
  status: HttpErrorResponse | null = null;

  constructor(
    private purchaseService: PurchaseAjaxService,
    private sessionService: SessionAjaxService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getCompras();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getCompras();
        }
      }
    })
  }

  getCompras(): void {
    this.sessionService.getSessionUser()?.subscribe({
      next: (user: IUser) => {
        this.user = user;
        const rows: number = this.paginatorState.rows ?? 0;
        const page: number = this.paginatorState.page ?? 0;
        this.purchaseService.getPurchaseByUsuarioId(this.user?.id, rows, page, this.orderField, this.orderDirection, ).subscribe({
          next: (page: IPurchasePage) => {
            this.page = page;
            this.paginatorState.pageCount = this.page.totalPages;
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open('Error al obtener las compras', 'OK', { duration: 3000 });
          }
        });
      }
    })
    }
  
  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
    this.getCompras();
  }

}

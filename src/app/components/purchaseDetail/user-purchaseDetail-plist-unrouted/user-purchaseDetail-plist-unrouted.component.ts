import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IPurchase, IPurchaseDetailPage } from 'src/app/model/model.interfaces';
import { PurchaseAjaxService } from 'src/app/service/purchase.ajax.service';
import { PurchaseDetailAjaxService } from '../../../service/purchaseDetail.ajax.service';

@Component({
  selector: 'app-user-purchaseDetail-plist-unrouted',
  templateUrl: './user-purchaseDetail-plist-unrouted.component.html',
  styleUrls: ['./user-purchaseDetail-plist-unrouted.component.css']
})
export class UserPurchaseDetailPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() purchase_id: number = 0;
  @Input() product_id: number = 0;

  page: IPurchaseDetailPage | undefined;
  purchase: IPurchase | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0};
  status: HttpErrorResponse | null = null;
  
  constructor(
    private purchaseDetailAjaxService: PurchaseDetailAjaxService,
    private purchaseAjaxService: PurchaseAjaxService
  ) { }

  ngOnInit() {
    this.getPage();
    if (this.purchase_id > 0) {
      this.getCompra();
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
    const rows = this.paginatorState.rows ?? 0;
    const page = this.paginatorState.page ?? 0;
    this.purchaseDetailAjaxService.getPurchaseDetailByCompraId(this.purchase_id, rows, page, this.orderField, this.orderDirection).subscribe({
      next: (data: IPurchaseDetailPage) => {
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

    getCompra(): void {
      this.purchaseAjaxService.getPurchaseById(this.purchase_id).subscribe({
        next: (data: IPurchase) => {
          this.purchase = data;
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
        }
      })
    }

}

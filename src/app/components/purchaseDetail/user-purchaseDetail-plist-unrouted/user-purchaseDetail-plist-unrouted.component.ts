import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IProduct, IPurchase, IPurchaseDetailPage } from 'src/app/model/model.interfaces';
import { PurchaseAjaxService } from 'src/app/service/purchase.ajax.service';
import { PurchaseDetailAjaxService } from '../../../service/purchaseDetail.ajax.service';
import { Router } from '@angular/router';
import { PurchaseDetailPrintService } from './../../../service/purchaseDetail.print.service';

@Component({
  selector: 'app-user-purchaseDetail-plist-unrouted',
  templateUrl: './user-purchaseDetail-plist-unrouted.component.html',
  styleUrls: ['./user-purchaseDetail-plist-unrouted.component.css']
})
export class UserPurchaseDetailPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() purchase_id: number = 0;
  @Input() product_id: number = 0;
  @Input() id: number = 0;

  page: IPurchaseDetailPage | undefined;
  purchase: IPurchase | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0};
  status: HttpErrorResponse | null = null;
  product: IProduct = {} as IProduct;
  
  constructor(
    private purchaseDetailAjaxService: PurchaseDetailAjaxService,
    private purchaseAjaxService: PurchaseAjaxService,
    private oRouter: Router,
    private purchaseDetailPrintService: PurchaseDetailPrintService,
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

    calculateTotal(): string {
      let total = 0;
      if (this.page && this.page.content) {
        this.page.content.forEach(purchaseDetail => {
          total += purchaseDetail.price * purchaseDetail.amount;
        });
      }
      return total.toFixed(2);
    }

    doView(producto: IProduct) {
      this.oRouter.navigate(['/user', 'product', 'view', producto.id]);
    }

    generatePDF(): void {
      this.purchaseDetailPrintService.printFacturaCompra(this.purchase_id);
    }
  

}

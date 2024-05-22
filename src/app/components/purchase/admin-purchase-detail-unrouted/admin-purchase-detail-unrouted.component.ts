import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IPurchaseDetail, IPurchaseDetailPage } from 'src/app/model/model.interfaces';
import { PurchaseDetailAjaxService } from '../../../service/purchaseDetail.ajax.service';

@Component({
  selector: 'app-admin-purchase-detail-unrouted',
  templateUrl: './admin-purchase-detail-unrouted.component.html',
  styleUrls: ['./admin-purchase-detail-unrouted.component.css']
})
export class AdminPurchaseDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() size: number = 10;
  @Input() page: number = 0;
  @Input() sort: string = 'id';
  @Input() direction: string = 'asc';

  purchaseDetails: IPurchaseDetail[] = [];
  status: HttpErrorResponse | null = null;

  constructor(
    private purchaseDetailAjaxService: PurchaseDetailAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config && config.data) {
      this.id = config.data.id;
      this.size = config.data.size || this.size;
      this.page = config.data.page || this.page;
      this.sort = config.data.sort || this.sort;
      this.direction = config.data.direction || this.direction;
    }
  }

  ngOnInit() {
    this.getOne();
  }

  getOne(): void {
    this.purchaseDetailAjaxService.getPurchaseDetailByCompraId(this.id, this.size, this.page, this.sort, this.direction).subscribe({
      next: (data: IPurchaseDetailPage) => {
        this.purchaseDetails = data.content;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    });
  }

}
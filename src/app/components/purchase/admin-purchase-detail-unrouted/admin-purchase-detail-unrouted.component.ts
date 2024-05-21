import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IPurchaseDetail } from 'src/app/model/model.interfaces';
import { PurchaseDetailAjaxService } from '../../../service/purchaseDetail.ajax.service';

@Component({
  selector: 'app-admin-purchase-detail-unrouted',
  templateUrl: './admin-purchase-detail-unrouted.component.html',
  styleUrls: ['./admin-purchase-detail-unrouted.component.css']
})
export class AdminPurchaseDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  purchaseDetail: IPurchaseDetail = {} as IPurchaseDetail;
  status: HttpErrorResponse | null = null;

  constructor(
    private PurchaseDetailAjaxService: PurchaseDetailAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
  }

  ngOnInit() {
    this.getOne();
  }

  getOne(): void {
    this.PurchaseDetailAjaxService.getPurchaseDetailById(this.id).subscribe({
      next: (data: IPurchaseDetail) => {
        this.purchaseDetail = data;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    });
    }
     
  }
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Optional, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IPurchase } from 'src/app/model/model.interfaces';
import { PurchaseAjaxService } from 'src/app/service/purchase.ajax.service';

@Component({
  selector: 'app-user-purchase-detail-unrouted',
  templateUrl: './user-purchase-detail-unrouted.component.html',
  styleUrls: ['./user-purchase-detail-unrouted.component.css']
})
export class UserPurchaseDetailUnroutedComponent implements OnInit {

  @Input() id: number = 0;
  purchase: IPurchase = {} as IPurchase;
  status: HttpErrorResponse | null = null;


  constructor(
    private purchaseAjaxService: PurchaseAjaxService,
    private router: Router,
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
    this.getCompra();
    this.getDetailsArray();
  }

  getCompra() {
    this.purchaseAjaxService.getPurchaseById(this.id).subscribe({
      next: (data: IPurchase) => {
        this.purchase = data;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

  getDetailsArray(): number[] {
    return Array.from({ length: this.purchase.purchaseDetails }, (_, index) => index);
  }

}

import { ProductAjaxService } from './../../../service/product.ajax.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { IProduct} from 'src/app/model/model.interfaces';

@Component({
  selector: 'app-admin-product-detail-unrouted',
  templateUrl: './admin-product-detail-unrouted.component.html',
  styleUrls: ['./admin-product-detail-unrouted.component.css']
})
export class AdminProductDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  product: IProduct = {} as IProduct;
  status: HttpErrorResponse | null = null;
  
  constructor(
    private productAjaxService: ProductAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
   }

  ngOnInit(
  ) {
    this.getOne();
  }

  getOne() {
    this.productAjaxService.getProductById(this.id).subscribe({
      next: (data: IProduct) => {
        this.product = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

}
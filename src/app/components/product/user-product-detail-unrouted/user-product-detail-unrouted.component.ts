import { Component, Input, OnInit, Optional } from '@angular/core';
import { IProduct, IRating } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductAjaxService } from 'src/app/service/product.ajax.service';
import { RatingAjaxService } from './../../../service/rating.ajax.service';

@Component({
  selector: 'app-user-product-detail-unrouted',
  templateUrl: './user-product-detail-unrouted.component.html',
  styleUrls: ['./user-product-detail-unrouted.component.css']
})
export class UserProductDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  idProducto: number = 1;
  productSelected: IProduct[] = [];
  products: IProduct = {} as IProduct;
  status: HttpErrorResponse | null = null;
  rating: IRating[] = [];

  constructor(
    private productService: ProductAjaxService,
    private ratingService: RatingAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config && config.data) {
      this.id = config.data.id;
      console.log(this.config.data);
    }
  }

  ngOnInit() {
    console.log(this.id);
    this.getOne();

  }

  getOne(): void {
    this.productService.getProductById(this.id).subscribe({
      next: (data: IProduct) => {
        this.products = data;
        console.log(this.products);
        console.log(data.name);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
  
  addToCart(product: IProduct) {
    this.productSelected.push(product);
    console.log(`Producto '${product.name}' añadido al carrito.`);
  }
}
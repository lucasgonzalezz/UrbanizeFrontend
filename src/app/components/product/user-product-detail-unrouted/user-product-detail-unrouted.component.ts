import { Component, Input, OnInit, Optional } from '@angular/core';
import { ICart, IProduct, IRating } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ProductAjaxService } from 'src/app/service/product.ajax.service';
import { RatingAjaxService } from './../../../service/rating.ajax.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { IUser } from 'src/app/model/model.interfaces';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';
import { NavigationEnd, Router } from '@angular/router';
import { CartAjaxService } from './../../../service/cart.ajax.service';
import { PurchaseAjaxService } from './../../../service/purchase.ajax.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UserProductRatingFormUnroutedComponent } from '../user-product-rating-form-unrouted/user-product-rating-form-unrouted.component';

@Component({
  selector: 'app-user-product-detail-unrouted',
  templateUrl: './user-product-detail-unrouted.component.html',
  styleUrls: ['./user-product-detail-unrouted.component.css']
})
export class UserProductDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  cart: ICart = { user: {}, product: {}, amount: 0 } as ICart;
  cantidadSeleccionada: number = 1;
  status: HttpErrorResponse | null = null;
  product: IProduct = {} as IProduct;
  user: IUser | null = null;

  username: string = '';
  userSession: IUser | null = null;

  url: string = '';

  constructor(
    private productService: ProductAjaxService,
    private ratingService: RatingAjaxService,
    private sessionService: SessionAjaxService,
    private userAjaxService: UserAjaxService,
    private cartAjaxService: CartAjaxService,
    private purchaseAjaxService: PurchaseAjaxService,
    private oRouter: Router,
    private matSnackBar: MatSnackBar,
    private confirmService: ConfirmationService,
    public dialogService: DialogService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config && config.data) {
      this.id = config.data.id;
    }
    this.oRouter.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.url = ev.url;
      }
    })

    this.username = sessionService.getUsername();
    this.userAjaxService.getUserByUsername(this.sessionService.getUsername()).subscribe({
      next: (user: IUser) => {
        this.userSession = user;
        console.log('User Session:', this.userSession); // Agrega este log
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.getProduct();
    this.getUser();
  }

  getOne(): void {
    this.productService.getProductById(this.id).subscribe({
      next: (data: IProduct) => {
        this.product = data;
        console.log(this.product);
        console.log(data.name);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  getProduct() {
    this.productService.getProductById(this.id).subscribe({
      next: (data: IProduct) => {
        this.product = data;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

  getUser() {
    this.sessionService.getSessionUser()?.subscribe({
      next: (data: IUser) => {
        this.user = data;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

  agregarAlCarrito(): void {
    if (this.sessionService.isSessionActive()) {
      this.cart.user = { username: this.sessionService.getUsername() } as IUser;
      this.cart.product = { id: this.product.id } as IProduct;
      this.cart.amount = this.cantidadSeleccionada;
      this.cartAjaxService.createCart(this.cart).subscribe({
        next: (data: ICart) => {
          this.cart = data;
          this.matSnackBar.open('Producto añadido al carrito', 'Aceptar', { duration: 3000 });
          this.oRouter.navigate(['/user', 'cart', 'plist']);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al añadir la producto al carrito', 'Aceptar', { duration: 3000 });
        }
      });
    }
  }

  comprarDirectamente(): void {
    if (this.user) {
      const usuarioid = this.user.id;
      this.confirmService.confirm({
        message: `¿Quieres comprar ${this.cantidadSeleccionada} producto(s)?`,
        accept: () => {
          this.purchaseAjaxService.makeProductPurhase(this.product.id, usuarioid, this.cantidadSeleccionada).subscribe({
            next: () => {
              this.matSnackBar.open(`Has comprado ${this.cantidadSeleccionada} producto(s)`, 'Aceptar', { duration: 3000 });
              this.oRouter.navigate(['/user', 'purchase', 'plist', usuarioid]);
            }
          });
        },
        reject: () => {
          this.matSnackBar.open('Compra cancelada', 'Aceptar', { duration: 3000 });
        }
      });
    } else {
      this.matSnackBar.open('Debes estar logueado para comprar camisetas', 'Aceptar', { duration: 3000 });
    }
  }

   realizarValoracion(product: IProduct): void {
      const product_id = product.id;
      if (this.sessionService.isSessionActive()) {
        this.ref = this.dialogService.open(UserProductRatingFormUnroutedComponent, {
          data: {
            user_id: this.user?.id,
            product_id: product_id
          },
          header: 'Valorar producto',
          width: '70%',
          contentStyle: {"max-height": "500px", "overflow": "auto"},
          maximizable: false
          });
        };
      } 

}
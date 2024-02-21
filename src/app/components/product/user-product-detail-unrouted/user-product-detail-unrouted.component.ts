import { Component, Input, OnInit, Optional } from '@angular/core';
import { ICart, IProduct, IRating, IRatingPage } from 'src/app/model/model.interfaces';
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
import { Subject } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-user-product-detail-unrouted',
  templateUrl: './user-product-detail-unrouted.component.html',
  styleUrls: ['./user-product-detail-unrouted.component.css']
})
export class UserProductDetailUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id: number = 1;
  cart: ICart = { user: {}, product: {}, amount: 0 } as ICart;
  cantidadSeleccionada: number = 1;
  status: HttpErrorResponse | null = null;
  product: IProduct = {} as IProduct;
  user: IUser | null = null;
  paginatorState: PaginatorState = { first: 0, rows: 30, page: 0, pageCount: 0 };
  page: IRatingPage | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';

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
    this.getRatings();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getRatings();
        }
      }
    });
  }

  // En tu componente de Angular
increment() {
  if (this.cantidadSeleccionada < this.product.stock) {
      this.cantidadSeleccionada++;
  }
}

decrement() {
  if (this.cantidadSeleccionada > 1) {
      this.cantidadSeleccionada--;
  }
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

  getRatings() {
    const rows: number = this.paginatorState.rows ?? 0;
    const page: number = this.paginatorState.page ?? 0;
    this.ratingService.getRatingPageByProduct(this.id, rows, page, this.orderField, this.orderDirection).subscribe({
      next: (data: IRatingPage) => {
        this.page = data;
        this.paginatorState.pageCount = data.totalPages;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

  handleKeyDown(event: KeyboardEvent): void {
    // Verificar si la tecla presionada no es una flecha hacia arriba o abajo
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      event.preventDefault(); // Prevenir la acción predeterminada (escribir el valor)
    }
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
          this.ref.onClose.subscribe({
            next: (v) => {
              if (v) {
                this.getRatings();
              }
            }
          })
        };
      } 

      isUsuarioValoracion(rating: IRating): boolean {
        return this.user !== null && rating.user.id === this.user.id;
      }
  
      borrarValoracion(rating_id: number) {
        this.confirmService.confirm({
          message: '¿Quieres borrar la valoración?',
          accept: () => {
            this.ratingService.deleteRating(rating_id).subscribe({
              next: () => {
                this.matSnackBar.open('Valoración borrada', 'Aceptar', {duration: 3000});
                this.getRatings();
              },
              error: (err: HttpErrorResponse) => {
                this.status = err;
                this.matSnackBar.open('Error al borrar la valoración', 'Aceptar', {duration: 3000});
              }
            });
          }
        });
      }

}
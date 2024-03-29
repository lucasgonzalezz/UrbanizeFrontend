import { ConfirmationService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IProduct, ICart, ICartPage, IPurchase, IUser } from 'src/app/model/model.interfaces';
import { CartAjaxService } from './../../../service/cart.ajax.service';
import { PurchaseAjaxService } from 'src/app/service/purchase.ajax.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';

@Component({
  selector: 'app-user-cart-plist-unrouted',
  templateUrl: './user-cart-plist-unrouted.component.html',
  styleUrls: ['./user-cart-plist-unrouted.component.css']
})
export class UserCartPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  page: ICartPage | undefined;
  user: IUser | null = null;
  product: IProduct | null = null;
  cart: ICart = { user: {}, product: {}, amount: 0 } as ICart;
  totalCost: number = 0;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  individualPricel: Map<number, number> = new Map<number, number>();

  constructor(
    private cartAjaxService: CartAjaxService,
    private sessionAjaxService: SessionAjaxService,
    private purchaseAjaxService: PurchaseAjaxService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getCarts();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getCarts();
        }
      }
    })

  }

  getCarts(): void {
    this.sessionAjaxService.getSessionUser()?.subscribe({
      next: (user: IUser) => {
        this.user = user;
        const rows: number = this.paginatorState.rows ?? 0;
        const page: number = this.paginatorState.page ?? 0;
        this.cartAjaxService.getCartsByUser(this.user.id, rows, page, this.orderField, this.orderDirection).subscribe({
          next: (page: ICartPage) => {
            this.page = page;
            this.paginatorState.pageCount = this.page.totalPages;
            this.page.content.forEach((cart: ICart) => {
              this.getCostCart(cart);
            })
            this.updateTotalCost();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al recuperar los carritos', 'Aceptar', { duration: 3000 })
          }
        });
      }
    })
  }

  getCostCart(cart: ICart): void {
    const precioCamiseta = cart.product.price;
    const cantidad = cart.amount;
    const precioIndividual = precioCamiseta * cantidad;
    this.individualPricel.set(cart.id, precioIndividual);
  }

  updateAmount(cart: ICart, newAmount: number): void {
    const stockDisponible = cart.product.stock;

    if (newAmount >= 0 && newAmount <= stockDisponible) {

    cart.user = { id: cart.user.id } as IUser;
    cart.product = { id: cart.product.id } as IProduct;
    cart.amount = newAmount;
    if (newAmount == 0) {
      this.deleteCart(cart.id)
    } else {
      this.cartAjaxService.updateCart(cart).subscribe({
        next: (data: ICart) => {
          this.matSnackBar.open('Cantidad actualizada', 'Aceptar', { duration: 3000 });
          this.getCostCart(data);
          this.updateTotalCost();
          this.getCarts();
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al actualizar la cantidad', 'Aceptar', { duration: 3000 })
        }
      })
    }
  } else {
    this.matSnackBar.open('No hay suficiente stock disponible', 'Aceptar', { duration: 3000 });
  }
  }

  updateTotalCost(): void {
    this.sessionAjaxService.getSessionUser()?.subscribe({
      next: (user: IUser) => {
        this.user = user;
        this.cartAjaxService.getTotalCartCost(this.user.id).subscribe({
          next: (coste: number) => {
            this.totalCost = coste;
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al recuperar el coste total', 'Aceptar', { duration: 3000 })
          }
        })
      }
    })
  }

  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
    this.getCarts();
  }

  makeSingleCartPurchase(cart_id: number) {
    this.sessionAjaxService.getSessionUser()?.subscribe({
      next: (user: IUser) => {
        this.user = user;
        this.confirmationService.confirm({
          message: '¿Desea comprar este carrito?',
          accept: () => {
            this.purchaseAjaxService.makeSingleCartPurchase(user.id, cart_id).subscribe({
              next: (purchase: IPurchase) => {
                this.matSnackBar.open('Compra realizada', 'Aceptar', { duration: 3000 });
                this.router.navigate(['/user', 'purchase', 'view', purchase.id]);
              },
              error: (err: HttpErrorResponse) => {
                this.status = err;
                this.matSnackBar.open('Error al realizar la compra', 'Aceptar', { duration: 3000 })
              }
            });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al recuperar el usuario', 'Aceptar', { duration: 3000 })
      }
    });
  }

  makeAllCartPurchase() {
    this.sessionAjaxService.getSessionUser()?.subscribe({
      next: (user: IUser) => {
        this.user = user;
        this.confirmationService.confirm({
          message: '¿Desea comprar todos los carritos?',
          accept: () => {
            this.purchaseAjaxService.makeAllCartPurchase(user.id).subscribe({
              next: (purchase: IPurchase) => {
                this.matSnackBar.open('Compra realizada', 'Aceptar', { duration: 3000 });
                this.router.navigate(['/user', 'purchase', 'view', purchase.id]);
              },
              error: (err: HttpErrorResponse) => {
                this.status = err;
                this.matSnackBar.open('Error al realizar la compra', 'Aceptar', { duration: 3000 })
              }
            });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al recuperar el usuario', 'Aceptar', { duration: 3000 })
      }
    });

  }

  deleteCart(cart_id: number): void {

        this.cartAjaxService.deleteCart(cart_id).subscribe({
          next: () => {
            this.matSnackBar.open('Carrito eliminado', 'Aceptar', { duration: 3000 });
            this.getCarts();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al eliminar el carrito', 'Aceptar', { duration: 3000 })
          }
        });
  }

  deleteAllCarts(user_id: number): void {
    this.confirmationService.confirm({
      message: '¿Desea eliminar todos los carritos?',
      accept: () => {
        this.cartAjaxService.deleteCartByUsuario(user_id).subscribe({
          next: () => {
            this.matSnackBar.open('Carritos eliminados', 'Aceptar', { duration: 3000 });
            this.getCarts();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al eliminar los carritos', 'Aceptar', { duration: 3000 })
          }
        });
      }
    });
  }
}
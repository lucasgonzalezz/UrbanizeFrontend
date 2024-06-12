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
import Swal from 'sweetalert2';
import { ProductAjaxService } from 'src/app/service/product.ajax.service';

@Component({
  selector: 'app-user-cart-plist-unrouted',
  templateUrl: './user-cart-plist-unrouted.component.html',
  styleUrls: ['./user-cart-plist-unrouted.component.css']
})
export class UserCartPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  page: ICartPage | undefined;
  user: IUser | null = null;
  product: IProduct = {} as IProduct;
  cart: ICart = { user: {}, product: {}, amount: 0 } as ICart;
  totalCost: number = 0;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  individualPricel: Map<number, number> = new Map<number, number>();
  carts: ICart[] = []; // Change from cart to carts

  constructor(
    private cartAjaxService: CartAjaxService,
    private sessionAjaxService: SessionAjaxService,
    private purchaseAjaxService: PurchaseAjaxService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private productAjaxService: ProductAjaxService
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
            this.carts = this.page.content; // Assign fetched carts to carts property
            this.page.content.forEach((cart: ICart) => {
              this.getCostCart(cart);
            })
            this.updateTotalCost();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al recuperar los productos', 'Aceptar', { duration: 3000 })
          }
        });
      }
    })
  }

  getCostCart(cart: ICart): void {
    const precioProducto = cart.product.price;
    const cantidad = cart.amount;
    const precioIndividual = precioProducto * cantidad;
    this.individualPricel.set(cart.id, precioIndividual);
  }

  incrementAmount(cart: ICart, newAmount: number): void {
    const stockDisponible = cart.product.stock;
  
    if (newAmount >= 0 && stockDisponible != 0) {
      cart.user = { id: cart.user.id } as IUser;
      cart.product = { id: cart.product.id } as IProduct;
      cart.amount = newAmount;
  
      if (newAmount === 0) {
        this.deleteCart(cart, cart.id);
      } else {
        this.cartAjaxService.updateCart(cart).subscribe({
          next: (data: ICart) => {
            this.getCostCart(data);
            this.updateTotalCost();
            this.getCarts();
            this.actualizarStock(cart.product.id, -1);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al actualizar la cantidad', 'Aceptar', { duration: 3000 });
          }
        });
      }
    } else {
      this.matSnackBar.open('No hay más stock disponible', 'Aceptar', { duration: 3000 });
    }
  }
  

  decrementAmount(cart: ICart, newAmount: number): void {
    if (newAmount >= 0) {
      cart.user = { id: cart.user.id } as IUser;
      cart.product = { id: cart.product.id } as IProduct;
      cart.amount = newAmount;
      
      if (newAmount === 0) {
        this.deleteCart(cart, cart.id);
        this.actualizarStock(cart.product.id, 1);
      } else {
        this.cartAjaxService.updateCart(cart).subscribe({
          next: (data: ICart) => {
            this.getCostCart(data);
            this.updateTotalCost();
            this.getCarts();
            this.actualizarStock(cart.product.id, 1);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al actualizar la cantidad', 'Aceptar', { duration: 3000 });
          }
        });
      }
    } else {
      this.matSnackBar.open('No se puede decrementar la cantidad a un valor negativo', 'Aceptar', { duration: 3000 });
    }
  }
  
  actualizarStock(productId: number, cantidadSeleccionada: number): void {
    const amount = +cantidadSeleccionada;
  
    this.productAjaxService.updateStock(productId, amount).subscribe({
      next: () => {
        this.product.stock -= cantidadSeleccionada;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar el stock del producto:', err);
      }
    });
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

  makeSingleCartPurchase(cart_id: number, cart: ICart) {
    this.sessionAjaxService.getSessionUser()?.subscribe({
     
      next: (user: IUser) => {
        this.user = user;
        Swal.fire({
          title: "¿Quieres comprar este producto?",
          html: `
            <div style="text-align: center;">
              <p>${cart.product.name}</p><br>
              <p>Cantidad: <strong>${cart.amount}</strong></p><br>
              <p>Precio: <strong>${ this.individualPricel.get(cart.id)?.toFixed(2) + " €"  }</strong></p>
            </div>
          `,
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#164e63",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, comprar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.purchaseAjaxService.makeSingleCartPurchase(user.id, cart_id).subscribe({
              next: (purchase: IPurchase) => {
                this.matSnackBar.open('Compra realizada', 'Aceptar', { duration: 3000 });
                this.router.navigate(['/user', 'purchase', 'view', purchase.id]);
              },
              error: (err: HttpErrorResponse) => {
                this.status = err;
                this.matSnackBar.open('Error al realizar la compra', 'Aceptar', { duration: 3000 });
              }
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.matSnackBar.open('Compra cancelada', 'Aceptar', { duration: 3000 });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al recuperar el usuario', 'Aceptar', { duration: 3000 });
      }
    });
  }

  makeAllCartPurchase() {
    this.sessionAjaxService.getSessionUser()?.subscribe({
      next: (user: IUser) => {
        this.user = user;
        let cartDetailsHTML = '';
        this.page?.content.forEach((cart: ICart) => {
          cartDetailsHTML += `
            <div style="text-align: center;"><br>
              <p>${cart.product.name}</p><br>
              <p>Cantidad: <strong>${cart.amount}</strong></p><br>
              <p>Precio: <strong>${this.individualPricel.get(cart.id)?.toFixed(2) + " €"}</strong></p><br>
              <p>--------------------------------</p>
            </div>
            <hr>
          `;
        });
        Swal.fire({
          title: "¿Quieres comprar todos los productos del carrito?",
          html: cartDetailsHTML,
          width: 800,
          showCancelButton: true,
          confirmButtonColor: "#164e63",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, comprar",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.purchaseAjaxService.makeAllCartPurchase(user.id).subscribe({
              next: (purchase: IPurchase) => {
                this.matSnackBar.open('Compra realizada', 'Aceptar', { duration: 3000 });
                this.router.navigate(['/user', 'purchase', 'view', purchase.id]);
              },
              error: (err: HttpErrorResponse) => {
                this.status = err;
                this.matSnackBar.open('Error al realizar la compra', 'Aceptar', { duration: 3000 });
              }
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.matSnackBar.open('Compra cancelada', 'Aceptar', { duration: 3000 });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al recuperar el usuario', 'Aceptar', { duration: 3000 });
      }
    });
  }

  deleteCart(cart: ICart, cart_id: number): void {

        this.cartAjaxService.deleteCart(cart_id).subscribe({
          next: () => {
            this.matSnackBar.open('Producto eliminado de la cesta', 'Aceptar', { duration: 3000 });
            this.getCarts();
            this.actualizarStock(cart.product.id, +cart.amount);

          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al eliminar el producto de las cesta', 'Aceptar', { duration: 3000 })
          }
        });
  }

  deleteAllCarts(user_id: number): void {
    Swal.fire({
      title: "¿Desea eliminar todos los productos de la cesta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#164e63",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Antes de eliminar todos los carritos, guardamos las cantidades de cada producto
        const quantitiesToRestore: { productId: number, quantity: number }[] = [];
  
        for (const cart of this.carts) {
          quantitiesToRestore.push({ productId: cart.product.id, quantity: cart.amount });
        }
  
        this.cartAjaxService.deleteCartByUsuario(user_id).subscribe({
          next: () => {
            this.matSnackBar.open('Productos eliminados de la cesta', 'Aceptar', { duration: 3000 });
  
            // Devolver el stock de cada producto
            for (const item of quantitiesToRestore) {
              this.actualizarStock(item.productId, item.quantity);
            }
  
            this.getCarts();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al eliminar los productos', 'Aceptar', { duration: 3000 });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.matSnackBar.open('Eliminación de productos cancelada', 'Aceptar', { duration: 3000 });
      }
    });
  }
  
  
}
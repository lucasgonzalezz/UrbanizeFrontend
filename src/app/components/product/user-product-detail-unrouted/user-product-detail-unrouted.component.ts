import { Component, Input, OnInit, Optional } from '@angular/core';
import { ICart, IProduct, IProductPage, IRating, IRatingPage } from 'src/app/model/model.interfaces';
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
import Swal from 'sweetalert2';

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
  user: IUser = {} as IUser;
  paginatorState: PaginatorState = { first: 0, rows: 30, page: 0, pageCount: 0 };
  page: IRatingPage | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  rating: IRating | null = null;
  userPurchased: boolean = false;
  userRatinged: boolean = false;

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
    this.verifyRating();
    console.log(this.userPurchased);
    console.log(this.userRatinged);
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getRatings();
          this.verifyRating();
        }
      }
    });
  }

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

  verifyRating() {
    this.sessionService.getSessionUser()?.subscribe({
      next: (data: IUser) => {
        this.user = data;

        if (this.user) {
          this.userPurchased = false;
          this.userRatinged = false;

          this.productService.getProductPurchased(this.user.id, 100, 0, 'id', 'asc').subscribe({
            next: (page: IProductPage) => {
              const productos = page.content;
              this.userPurchased = productos.some(product => product.id === this.product.id);

              this.ratingService.getRatingByUserAndProduct(this.user.id, this.product.id).subscribe({
                next: (rating: IRating) => {
                  this.userRatinged = !!rating;
                },
                error: (err: HttpErrorResponse) => {
                  this.status = err;
                  console.error('Error al obtener la valoración', err);
                }
              });
            },
            error: (err: HttpErrorResponse) => {
              this.status = err;
              console.error('Error al obtener los productos comprados', err);
            }
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        console.error('Error al obtener la sesión del usuario', err);
      }
    });
  }


  handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      event.preventDefault();
    }
  }

  agregarAlCarrito(): void {
    if (this.sessionService.isSessionActive()) {
      this.cart.user = { username: this.sessionService.getUsername() } as IUser;
      this.cart.product = { id: this.product.id } as IProduct;
      this.cart.amount = this.cantidadSeleccionada;
      this.cartAjaxService.createCart(this.cart).subscribe({
        next: (data: ICart) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "El producto se ha añadido al carrito",
            showConfirmButton: false,
            timer: 1500,
            width: 600,
          });
          this.actualizarStock(this.product.id, this.cantidadSeleccionada);
          this.cantidadSeleccionada = 1;
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al añadir el producto al carrito', 'Aceptar', { duration: 3000 });
        }
      });
    }
  }

  actualizarStock(productId: number, cantidadSeleccionada: number): void {
    const amount = -cantidadSeleccionada;
  
    this.productService.updateStock(productId, amount).subscribe({
      next: () => {
        this.product.stock -= cantidadSeleccionada;
        console.log('Stock actualizado correctamente.');
        console.log('Stock actual:', this.product.stock);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar el stock del producto:', err);
      }
    });
  }
  
  comprarDirectamente(): void {
    if (this.user) {
      const usuarioid = this.user.id;
      Swal.fire({
        title: "¿Estás seguro de comprar el producto?",
        html: `
          <div style="text-align: center;">
            <p>${this.product.name}</p><br>
            <p>Cantidad: <strong>${this.cantidadSeleccionada}</strong></p><br>
            <p>Precio: <strong>${this.product.price}€</strong></p>
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
          this.purchaseAjaxService.makeProductPurhase(this.product.id, usuarioid, this.cantidadSeleccionada).subscribe({
            next: () => {
              this.matSnackBar.open(`Has comprado ${this.cantidadSeleccionada} producto(s)`, 'Aceptar', { duration: 3000 });
              this.oRouter.navigate(['/user', 'purchase', 'plist', usuarioid]);
            },
            error: () => {
              this.matSnackBar.open('Ha ocurrido un error al realizar la compra', 'Aceptar', { duration: 3000 });
            }
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.matSnackBar.open('Compra cancelada', 'Aceptar', { duration: 3000 });
        }
      });
    } else {
      this.matSnackBar.open('Debes estar logueado para comprar camisetas', 'Aceptar', { duration: 3000 });
    }
  }

  realizarValoracion(product: IProduct, user: IUser): void {
    const product_id = product.id;
    const user_id = user.id;
  
    this.ratingService.getRatingByUserAndProduct(user_id, product_id).subscribe({
      next: (rating: IRating) => {
        this.userRatinged = !!rating;
  
        if (this.userRatinged) {
          Swal.fire({
            position: "center",
            width: 500,
            icon: "error",
            title: "Ya has valorado este producto",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (!this.userPurchased) {
          Swal.fire({
            position: "center",
            width: 500,
            icon: "error",
            title: "Debes comprar el producto para valorarlo",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          if (this.sessionService.isSessionActive()) {
            this.ref = this.dialogService.open(UserProductRatingFormUnroutedComponent, {
              data: {
                user_id: this.user?.id,
                product_id: product_id
              },
              header: 'Valorar producto',
              width: '70%',
              contentStyle: { "max-height": "500px", "overflow": "auto" },
              maximizable: false
            });
  
            this.ref.onClose.subscribe({
              next: (v) => {
                if (v) {
                  this.getRatings();
                  this.verifyRating();
                }
              }
            });
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        console.error('Error al obtener la valoración', err);
      }
    });
  }
  

  isUsuarioValoracion(rating: IRating): boolean {
    return this.user !== null && rating.user.id === this.user.id;
  }

  borrarValoracion(rating_id: number) {
    Swal.fire({
      title: "¿Estás seguro de eliminar la valoración?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#164e63",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    }).then((result) => {
      this.ratingService.deleteRating(rating_id).subscribe({
        next: () => {
          this.matSnackBar.open('Valoración borrada', 'Aceptar', { duration: 3000 });
          this.getRatings();
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al borrar la valoración', 'Aceptar', { duration: 3000 });
        }
      });
    });
  }

}
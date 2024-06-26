import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IProduct, IProductPage, IPurchase, ICategory, ICategoryPage, ICart } from 'src/app/model/model.interfaces';
import { PurchaseAjaxService } from './../../../service/purchase.ajax.service';
import { ProductAjaxService } from './../../../service/product.ajax.service';
import { SessionAjaxService } from './../../../service/session.ajax.service';
import { CategoryAjaxService } from './../../../service/category.ajax.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { IUser } from 'src/app/model/model.interfaces';
import { CartAjaxService } from './../../../service/cart.ajax.service';
import { ElementRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-product-plist-unrouted',
  templateUrl: './user-product-plist-unrouted.component.html',
  styleUrls: ['./user-product-plist-unrouted.component.css']
})
export class UserProductPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() category_id: number = 0;
  productosSeleccionados: IProduct[] = [];
  page: IProductPage | undefined;
  purchase: IPurchase = {} as IPurchase;
  orderField: string = "id";
  orderDirection: string = "asc";
  products: IProduct[] = [];
  category: ICategory[] = [];
  product: IProduct = {} as IProduct;
  oPaginatorState: PaginatorState = { first: 0, rows: 16, page: 0, pageCount: 0 };
  value: string = '';
  status: HttpErrorResponse | null = null;
  oProductToRemove: IProduct | null = null;
  ref: DynamicDialogRef | undefined;
  oCategory: ICategory | null = null;
  strUserName: string = '';
  username: string = '';
  userSession: IUser | null = null;
  idCategoriaFiltrada: number | null = null;
  filtrandoPorCategoria: boolean = false;
  productosPorPagina: number = 8;
  cart: ICart = { user: {}, product: {}, amount: 0 } as ICart;
  cantidadSeleccionada: number = 1;

  url: string = '';

  constructor(
    private productService: ProductAjaxService,
    private cartAjaxService: CartAjaxService,
    public dialogService: DialogService,
    private sessionService: SessionAjaxService,
    private categoryService: CategoryAjaxService,
    private oRouter: Router,
    private userAjaxService: UserAjaxService,
    private purchaseService: PurchaseAjaxService,
    private confirmService: ConfirmationService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private el: ElementRef,
  ) {

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
      }
    });
  }

  ngOnInit() {
    this.strUserName = this.sessionService.getUsername();
    this.getPage();
    this.getCategorias();
    if (this.category_id > 0) {
      this.getCategoria();
    }

    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }

  quitarFiltro(): void {
    this.value = ''; // Limpiar el valor del filtro de búsqueda

    this.productService.getPageProducts(
      this.oPaginatorState.rows,
      this.oPaginatorState.page,
      this.orderField,
      this.orderDirection,
      0 // Filtro por categoría establecido a 0 para mostrar todos los productos
    ).subscribe({
      next: (data: IProductPage) => {
        this.page = data;
        this.oPaginatorState.pageCount = data.totalPages;
        this.products = data.content;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });

    this.category_id = 0; // Restablecer el valor de id_categoria a 0

    this.filtrandoPorCategoria = false; // Desactivar la bandera de filtrado por categoría
  }

  onInputChange(query: string): void {
    if (query.length > 2) {
      this.productService
        .getPageProducts(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.category_id, query)
        .subscribe({
          next: (data: IProductPage) => {
            this.page = data;
            this.products = data.content;
            this.oPaginatorState.pageCount = data.totalPages;
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
          }
        });
    } else {
      this.getPage();
    }
  }

  getPage(): void {
    this.productService
      .getPageProducts(
        this.oPaginatorState.rows,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        this.category_id
      )
      .subscribe({
        next: (data: IProductPage) => {
          this.page = data;
          this.oPaginatorState.pageCount = data.totalPages;
          this.products = data.content;
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
        },
      });
  }

  onPageChange(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
    
    this.scrollToTop();
  }
  
  private scrollToTop() {
    const element = this.el.nativeElement;
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
  

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    this.orderDirection = this.orderDirection == "asc" ? "desc" : "asc";
    this.getPage();
  }

  getCategoria(): void {
    this.categoryService.getCategoryById(this.category_id).subscribe({
      next: (data: ICategory) => {
        this.oCategory = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  getCategorias(): void {
    this.categoryService.getCategoryPage(undefined, undefined, 'id', 'asc').subscribe({
      next: (data: ICategoryPage) => {
        this.category = data.content;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al obtener las categorías', error);
      }
    });
  }

  agregarAlCarrito(product: IProduct): void {
    if (this.sessionService.isSessionActive()) {
      this.cart.user = { username: this.sessionService.getUsername() } as IUser;
      this.cart.product = { id: product.id } as IProduct;
      this.cart.amount = 1;
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
          this.actualizarStock(product.id, product);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al añadir el producto al carrito', 'Aceptar', { duration: 3000 });
        }
      });
    }
  }
  
  actualizarStock(productId: number, product: IProduct): void {
    const amount = -1;
  
    this.productService.updateStock(productId, amount).subscribe({
      next: () => {
        product.stock -= 1;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar el stock del producto:', err);
      }
    });
  }
  

  getTotalAPagar(): number {
    const totalAPagar = this.productosSeleccionados.reduce((total, producto) => total + producto.price, 0);
    return totalAPagar;
  }

  doView(producto: IProduct) {
    this.oRouter.navigate(['/user', 'product', 'view', producto.id]);
  }

  makeProductPurhase(product: IProduct): void {
    this.sessionService.getSessionUser()?.subscribe({
      next: (user: IUser) => {
        if (user) {
          Swal.fire({
            title: "¿Quieres comprar este producto?",
            html: `
              <div style="text-align: center;">
                <p>${product.name}</p><br>
                <p>Precio: <strong>${product.price}€</strong></p>
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
              const cantidad = 1;
              this.purchaseService.makeProductPurhase(product.id, user.id, cantidad).subscribe({
                next: (purchase: IPurchase) => {
                  this.router.navigate(['/user', 'purchase', 'view', purchase.id]);
                },
                error: (err: HttpErrorResponse) => {
                  this.status = err;
                  this.matSnackBar.open('Error al comprar el producto', 'Aceptar', { duration: 3000 });
                }
              });
            } else if (result.dismiss === Swal.DismissReason.cancel) {            }
          });
        } else {
          this.matSnackBar.open('Debes estar logueado para comprar productos', 'Aceptar', { duration: 3000 });
        };
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
        this.matSnackBar.open('Error al obtener el usuario', 'Aceptar', { duration: 3000 });
      }
    });
  }
  
  // Método para filtrar por categoría cuando se hace clic en una categoría
  filtrarPorCategoria(idCategoria: number): void {
    this.category_id = idCategoria;
    this.getPage();
    this.idCategoriaFiltrada = idCategoria;
    this.filtrandoPorCategoria = true;
  }
}
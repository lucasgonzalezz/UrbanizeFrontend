import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IProduct, IProductPage, IPurchase, ICategory, ICategoryPage } from 'src/app/model/model.interfaces';
import { PurchaseAjaxService } from './../../../service/purchase.ajax.service';
import { ProductAjaxService } from './../../../service/product.ajax.service';
import { SessionAjaxService } from './../../../service/session.ajax.service';
import { CategoryAjaxService } from './../../../service/category.ajax.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { IUser } from 'src/app/model/model.interfaces';


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
  purchase: IPurchase | null = null;
  orderField: string = "id";
  orderDirection: string = "asc";
  products: IProduct[] = [];
  category: ICategory[] = [];
  oPaginatorState: PaginatorState = { first: 0, rows: 16, page: 0, pageCount: 0 };
  value: string = '';
  status: HttpErrorResponse | null = null;
  oProductToRemove: IProduct | null = null;
  ref: DynamicDialogRef | undefined;
  oCategory: ICategory | null = null;
  strUserName: string = '';
  username: string = '';
  userSession: IUser | null = null;

  url: string = '';


  constructor(
    private productService: ProductAjaxService,
    public dialogService: DialogService,
    private sessionService: SessionAjaxService,
    private categoryService: CategoryAjaxService,
    private oRouter: Router,
    private userAjaxService: UserAjaxService,
  ) { 
    console.log('MenuUnroutedComponent created'); // Agrega este log al constructor

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


  onInputChange(query: string): void {
    if (query.length > 2) {
      this.productService
        .getPageProducts(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.category_id, query)
        .subscribe({
          next: (data: IProductPage) => {
            this.page = data;
            this.products = data.content;
            this.oPaginatorState.pageCount = data.totalPages;
            console.log(this.oPaginatorState);
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
          
          console.log(this.products);
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

  addToCart(producto: IProduct) {
    this.productosSeleccionados.push(producto);
    console.log(`Producto '${producto.name}' añadido al carrito.`);
  }

  getTotalAPagar(): number {
    const totalAPagar = this.productosSeleccionados.reduce((total, producto) => total + producto.price, 0);
    return totalAPagar;
  }



  doView(producto: IProduct) {
    this.oRouter.navigate(['/user', 'product', 'view', producto.id]);
  }

}


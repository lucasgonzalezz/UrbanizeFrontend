import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IPurchase, IPurchasePage, IUser } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import Swal from 'sweetalert2';
import { PurchaseAjaxService } from '../../../service/purchase.ajax.service';
import { AdminPurchaseDetailUnroutedComponent } from '../admin-purchase-detail-unrouted/admin-purchase-detail-unrouted.component';

@Component({
  selector: 'app-admin-purchase-plist-unrouted',
  templateUrl: './admin-purchase-plist-unrouted.component.html',
  styleUrls: ['./admin-purchase-plist-unrouted.component.css']
})
export class AdminPurchasePlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() user_id: number = 0;

  page: IPurchasePage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  purhaseABorrar: IPurchase | null = null;
  usuarios: IUser[] = []; 
  user: IUser | null = null;

  value: string = '';

  constructor(
    private purchaseAjaxService: PurchaseAjaxService,
    private userAjaxService: UserAjaxService,
    public dialogService: DialogService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPage();

    if (this.user_id > 0) {
      this.getUser();
    }
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    })
  }

  getPage(): void {
    const rows = this.paginatorState.rows ?? 0;
    const page = this.paginatorState.page ?? 0;
    console.log("User ID:", this.user_id);
    this.purchaseAjaxService.getPagePurchases(rows, page, this.orderField, this.orderDirection, this.user_id).subscribe({
        next: (page: IPurchasePage) => {
            this.page = page;
            this.paginatorState.pageCount = page.totalPages;
        },
        error: (response: HttpErrorResponse) => {
            this.status = response;
        }
    });
}

  
  // getPage(): void {
  //   const page: number = this.paginatorState.page ?? 0;
  //   const rows: number = this.paginatorState.rows ?? 0;
  //   this.ratingAjaxService.getRatingPage(rows, page, this.orderField, this.orderDirection, this.user_id, this.product_id).subscribe({
  //     next: (page: IRatingPage) => {
  //       this.page = page;
  //       this.paginatorState.pageCount = page.totalPages;
  //     },
  //     error: (response: HttpErrorResponse) => {
  //       this.status = response;
  //     }
  //   });
  //   }

  getUser(): void {
    this.userAjaxService.getUserById(this.user_id).subscribe({
      next: (data: IUser) => {
        this.user = data;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    });
  }

  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    this.orderDirection = this.orderDirection === "asc" ? "desc" : "asc";
    this.getPage();
  }

  doView(purchase: IPurchase) {
    let ref: DynamicDialogRef | undefined;
    ref = this.dialogService.open(AdminPurchaseDetailUnroutedComponent, {
      width: '70%',
      maximizable: false,
      data: { id: purchase.id, ref }
    });
  }

  doRemove(purchase: IPurchase) {
    this.purhaseABorrar = purchase;
    Swal.fire({
      title: "¿Estás seguro de eliminar la compra?",
      html: `
        <div style="text-align: center;">
          <br><p>Código: <strong>${purchase.purchaseCode}</strong></p><br>
          <p>Nombre de usuario: <strong>${purchase.user.username}</strong></p><br>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#164e63",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.matSnackBar.open("Se ha eliminado la compra", 'Aceptar', { duration: 3000 });
        this.purchaseAjaxService.deletePurchase(purchase.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.matSnackBar.open("No se ha podido eliminar el usuario", 'Aceptar', { duration: 3000 });
      }
    })
  }
}
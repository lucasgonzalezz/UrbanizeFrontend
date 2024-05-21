import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { AdminUserDetailUnroutedComponent } from '../admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import Swal from 'sweetalert2';

@Component({
  providers: [DialogService, ConfirmationService],
  selector: 'app-admin-user-plist-unrouted',
  templateUrl: './admin-user-plist-unrouted.component.html',
  styleUrls: ['./admin-user-plist-unrouted.component.css']
})
export class AdminUserPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  page: IUserPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  usuarioABorrar: IUser | null = null;
  usuarios: IUser[] = []; 

  value: string = '';

  constructor(
    private userAjaxService: UserAjaxService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    })
  }

  getPage(): void {

    this.userAjaxService.getUserPage(this.paginatorState.rows, this.paginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IUserPage) => {
        this.page = data;
        this.paginatorState.pageCount = data.totalPages;
        this.usuarios = data.content;
      },
      error: (response: HttpErrorResponse) => {
        this.status = response;
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
    this.orderDirection = this.orderDirection ==="asc" ? "desc" : "asc";
    this.getPage();
  }

  doView(user: IUser) {
    let ref: DynamicDialogRef | undefined;
    ref = this.dialogService.open(AdminUserDetailUnroutedComponent, {
      width: '70%',
      maximizable: false,
      data: { id: user.id, ref }
    });
  }

  doRemove(user: IUser) {
    this.usuarioABorrar = user;
    Swal.fire({
      title: "¿Estás seguro de eliminar el usuario?",
      html: `
        <div style="text-align: center;">
          <br><p>Nombre: <strong>${user.username}</strong></p><br>
          <p>DNI: <strong>${user.dni}</strong></p><br>
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
        this.matSnackBar.open("Se ha eliminado el usuario", 'Aceptar', { duration: 3000 });
        this.userAjaxService.deleteUser(user.id).subscribe({
          next: () => {
            this.getPage();
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
          }
        });
      }
      reject: (type: ConfirmEventType) => {
        this.matSnackBar.open("No se ha podido eliminar el usuario", 'Aceptar', { duration: 3000 });
      }
    })
  }

  onInputChange(query: string): void {
    if (query.length > 2) {
      this.userAjaxService
        .getUserPage(this.paginatorState.rows, this.paginatorState.page, this.orderField, this.orderDirection, query)
        .subscribe({
          next: (data: IUserPage) => {
            this.page = data;
            this.usuarios = data.content;
            this.paginatorState.pageCount = data.totalPages;
            console.log(this.paginatorState);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
          }
        });
    } else {
      this.getPage();
    }
  }

}

